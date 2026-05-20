# Changelog

## [Unreleased]

### Backlog
- Replace transparent logo asset with approved production variant.
- Configure WhatsApp Business profile and operational routing.
- Implement NFC digital business card module and landing integration.
- Expand portfolio dataset with additional published projects.

## [2026-05-20]

### Added
- Technical SEO baseline: meta tags, canonical, hreflang, robots directives.
- Build-time generation for `robots.txt` and `sitemap.xml`.
- JSON-LD graph nodes: `Organization`, `ProfessionalService`, `WebSite`, `WebPage`, `Service`.
- GA4 instrumentation (`G-3GGD52GQ13`) with Consent Mode v2 defaults.
- Funnel analytics events: `navigation_click`, `generate_lead`, `select_content`, `view_section`.
- Apache rewrite policy for HTTPS and host normalization.
- Localhost rewrite bypass for non-production environments.
- XML stylesheet (`sitemap.xsl`) for human-readable sitemap rendering.

### Changed
- Schema service modeling migrated to `OfferCatalog` + `Offer` + `itemOffered` relations.
- Redirect strategy refactored to domain-agnostic rules (no hardcoded host).

### Fixed
- Canonical and sitemap host consistency aligned to production URL strategy.
- Schema validation warnings reduced by removing unsupported property mappings.

### Docs
- Deployment runbook updated for shared-host production workflows.
- Production-safe Git workflow guidance added for pull-based environments.

## [2026-05-19]

### Added
- Initial project bootstrap and repository baseline.
- Landing page first production-ready load.
- Initial portfolio item dataset integration.
