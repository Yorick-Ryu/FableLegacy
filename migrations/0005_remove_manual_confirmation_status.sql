UPDATE archive_projects
SET evidence = 'community'
WHERE evidence = 'needs-review';

UPDATE archive_sources
SET note = 'Official community showcase thread with individual media links gathered as public archive leads.'
WHERE id = 'claude-social-thread';

UPDATE archive_source_translations
SET note = '官方社区展示线程，收录公开可见的媒体线索。'
WHERE source_id = 'claude-social-thread' AND locale = 'zh';
