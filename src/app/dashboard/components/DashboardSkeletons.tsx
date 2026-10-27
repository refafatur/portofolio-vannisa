interface SkeletonProps {
  count?: number;
}

export function ItemCardsSkeleton({ count = 3 }: SkeletonProps) {
  return (
    <div className="items-grid dashboard-skeleton-grid" role="status" aria-label="Memuat data">
      {Array.from({ length: count }, (_, index) => (
        <div className="item-card dashboard-item-skeleton" key={index} aria-hidden="true">
          <div className="dashboard-skeleton dashboard-item-skeleton-image" />
          <div className="item-content">
            <div className="dashboard-skeleton dashboard-item-skeleton-title" />
            <div className="dashboard-skeleton dashboard-item-skeleton-description" />
          </div>
          <div className="item-actions">
            <div className="dashboard-skeleton dashboard-item-skeleton-button" />
            <div className="dashboard-skeleton dashboard-item-skeleton-button" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TimelineRowsSkeleton({ count = 3 }: SkeletonProps) {
  return (
    <div className="timeline-skeleton-list" role="status" aria-label="Memuat data timeline">
      {Array.from({ length: count }, (_, index) => (
        <div className="timeline-skeleton-row" key={index} aria-hidden="true">
          <div className="dashboard-skeleton" />
          <div className="dashboard-skeleton" />
          <div className="dashboard-skeleton" />
          <div className="timeline-skeleton-actions">
            <div className="dashboard-skeleton" />
            <div className="dashboard-skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardActivitySkeleton({ count = 3 }: SkeletonProps) {
  return (
    <div className="activity-list dashboard-activity-skeleton" role="status" aria-label="Memuat aktivitas">
      {Array.from({ length: count }, (_, index) => (
        <div className="activity-item" key={index} aria-hidden="true">
          <div className="dashboard-skeleton dashboard-activity-icon" />
          <div className="activity-content">
            <div className="dashboard-skeleton dashboard-activity-line" />
            <div className="dashboard-skeleton dashboard-activity-time" />
          </div>
        </div>
      ))}
    </div>
  );
}
