type Env = {
  FABLE_LEGACY_DB?: D1Database;
};

type ProjectRow = {
  id: string;
  name: string;
  author: string;
  project_type: string;
  usage: string;
  summary: string;
  source_url: string;
  project_url: string | null;
  media_url: string | null;
  published_date: string;
  evidence: string;
  image_hint: string;
};

type ProjectTranslationRow = {
  project_id: string;
  locale: string;
  name: string;
  author: string;
  usage: string;
  summary: string;
  image_hint: string;
};

type TagRow = {
  project_id: string;
  tag: string;
};

type TimelineRow = {
  id: string;
  event_date: string;
  title: string;
  body: string;
};

type TimelineTranslationRow = {
  event_id: string;
  locale: string;
  title: string;
  body: string;
};

type SourceRow = {
  id: string;
  label: string;
  url: string;
  note: string;
};

type SourceTranslationRow = {
  source_id: string;
  locale: string;
  label: string;
  note: string;
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.FABLE_LEGACY_DB) {
    return json({ error: "Archive database is not configured" }, 503);
  }

  try {
    const [projectRows, translationRows, tagRows, timelineRows, timelineTranslationRows, sourceRows, sourceTranslationRows] =
      await env.FABLE_LEGACY_DB.batch([
        env.FABLE_LEGACY_DB.prepare(
          `SELECT id, name, author, project_type, usage, summary, source_url, project_url, media_url,
            published_date, evidence, image_hint
           FROM archive_projects
           WHERE status = 'published'
           ORDER BY sort_order ASC, published_date DESC`
        ),
        env.FABLE_LEGACY_DB.prepare(
          `SELECT project_id, locale, name, author, usage, summary, image_hint
           FROM archive_project_translations`
        ),
        env.FABLE_LEGACY_DB.prepare(
          `SELECT project_id, tag
           FROM archive_project_tags
           ORDER BY project_id ASC, sort_order ASC`
        ),
        env.FABLE_LEGACY_DB.prepare(
          `SELECT id, event_date, title, body
           FROM archive_timeline_events
           ORDER BY sort_order ASC, event_date ASC`
        ),
        env.FABLE_LEGACY_DB.prepare(
          `SELECT event_id, locale, title, body
           FROM archive_timeline_translations`
        ),
        env.FABLE_LEGACY_DB.prepare(
          `SELECT id, label, url, note
           FROM archive_sources
           ORDER BY sort_order ASC`
        ),
        env.FABLE_LEGACY_DB.prepare(
          `SELECT source_id, locale, label, note
           FROM archive_source_translations`
        )
      ]);

    const projectResults = (projectRows.results ?? []) as ProjectRow[];
    const translationResults = (translationRows.results ?? []) as ProjectTranslationRow[];
    const tagResults = (tagRows.results ?? []) as TagRow[];
    const timelineResults = (timelineRows.results ?? []) as TimelineRow[];
    const timelineTranslationResults = (timelineTranslationRows.results ?? []) as TimelineTranslationRow[];
    const sourceResults = (sourceRows.results ?? []) as SourceRow[];
    const sourceTranslationResults = (sourceTranslationRows.results ?? []) as SourceTranslationRow[];

    const tagsByProject = groupTags(tagResults);
    const projects = projectResults.map((project) => ({
      id: project.id,
      name: project.name,
      author: project.author,
      type: project.project_type,
      usage: project.usage,
      summary: project.summary,
      sourceUrl: project.source_url,
      projectUrl: project.project_url || undefined,
      mediaUrl: project.media_url || undefined,
      date: project.published_date,
      evidence: project.evidence,
      tags: tagsByProject[project.id] ?? [],
      imageHint: project.image_hint
    }));

    return json({
      projects,
      projectTranslations: groupProjectTranslations(translationResults),
      timeline: timelineResults.map((event) => ({
        id: event.id,
        date: event.event_date,
        title: event.title,
        body: event.body
      })),
      timelineTranslations: groupTimelineTranslations(timelineTranslationResults),
      sources: sourceResults.map((source) => ({
        id: source.id,
        label: source.label,
        url: source.url,
        note: source.note
      })),
      sourceTranslations: groupSourceTranslations(sourceTranslationResults)
    });
  } catch (error) {
    console.error("Unable to load archive data", error);
    return json({ error: "Unable to load archive data" }, 500);
  }
};

function groupTags(rows: TagRow[]) {
  return rows.reduce<Record<string, string[]>>((groups, row) => {
    groups[row.project_id] = [...(groups[row.project_id] ?? []), row.tag];
    return groups;
  }, {});
}

function groupProjectTranslations(rows: ProjectTranslationRow[]) {
  return rows.reduce<Record<string, Record<string, unknown>>>((groups, row) => {
    groups[row.locale] = {
      ...(groups[row.locale] ?? {}),
      [row.project_id]: {
        name: row.name,
        author: row.author,
        usage: row.usage,
        summary: row.summary,
        imageHint: row.image_hint
      }
    };
    return groups;
  }, {});
}

function groupTimelineTranslations(rows: TimelineTranslationRow[]) {
  return rows.reduce<Record<string, Record<string, unknown>>>((groups, row) => {
    groups[row.locale] = {
      ...(groups[row.locale] ?? {}),
      [row.event_id]: {
        title: row.title,
        body: row.body
      }
    };
    return groups;
  }, {});
}

function groupSourceTranslations(rows: SourceTranslationRow[]) {
  return rows.reduce<Record<string, Record<string, unknown>>>((groups, row) => {
    groups[row.locale] = {
      ...(groups[row.locale] ?? {}),
      [row.source_id]: {
        label: row.label,
        note: row.note
      }
    };
    return groups;
  }, {});
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60"
    }
  });
}
