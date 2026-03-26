export default function PageHeader({ eyebrow, title, description, actions, aside, level = 'h1' }) {
  const HeadingTag = level;

  return (
    <div className="page-header reveal">
      <div className="page-header-copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <HeadingTag className="page-title">{title}</HeadingTag>
        {description ? <p className="page-description">{description}</p> : null}
        {actions ? <div className="page-actions">{actions}</div> : null}
      </div>
      {aside ? <div className="page-header-aside">{aside}</div> : null}
    </div>
  );
}
