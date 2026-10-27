'use client';

import { useEffect, useState } from 'react';
import { TimelineRowsSkeleton } from '../components/DashboardSkeletons';

interface Timeline {
  id: string;
  year: string;
  title: string;
  description: string;
}

type TimelineForm = Omit<Timeline, 'id'>;

const emptyForm: TimelineForm = {
  year: '',
  title: '',
  description: '',
};

async function getResponseError(response: Response) {
  const result = await response.json().catch(() => null);
  return result && typeof result.error === 'string'
    ? result.error
    : `Request failed (${response.status})`;
}

export default function TimelineDashboard() {
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TimelineForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadTimelines() {
    setLoading(true);
    try {
      setError(null);
      const response = await fetch('/api/timeline');
      if (!response.ok) throw new Error(await getResponseError(response));

      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error('Timeline API returned an invalid response.');
      setTimelines(data);
    } catch (loadError) {
      console.error('Error loading timelines:', loadError);
      setError(loadError instanceof Error ? loadError.message : 'Failed to load timelines');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadTimelines();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  function openModal(timeline?: Timeline) {
    setEditingId(timeline?.id ?? null);
    setFormData(timeline
      ? { year: timeline.year, title: timeline.title, description: timeline.description }
      : { ...emptyForm });
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;
    setShowModal(false);
    setEditingId(null);
    setFormData({ ...emptyForm });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const Swal = (await import('sweetalert2')).default;

    try {
      const response = await fetch(
        editingId ? `/api/timeline/${editingId}` : '/api/timeline',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error(await getResponseError(response));

      await Swal.fire(
        'Success',
        editingId ? 'Timeline updated!' : 'Timeline added!',
        'success'
      );
      setShowModal(false);
      setEditingId(null);
      setFormData({ ...emptyForm });
      await loadTimelines();
    } catch (saveError) {
      console.error('Error saving timeline:', saveError);
      const message = saveError instanceof Error ? saveError.message : 'Failed to save timeline';
      await Swal.fire('Error', message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(timeline: Timeline) {
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: 'Delete Timeline?',
      text: `Delete "${timeline.title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/timeline/${timeline.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await getResponseError(response));
      await Swal.fire('Deleted', 'Timeline deleted.', 'success');
      await loadTimelines();
    } catch (deleteError) {
      console.error('Error deleting timeline:', deleteError);
      const message = deleteError instanceof Error ? deleteError.message : 'Failed to delete timeline';
      await Swal.fire('Error', message, 'error');
    }
  }

  return (
    <>
      <div className="card">
        <div className="card-header timeline-card-header">
          <h3 className="card-title">Education &amp; Experience Timeline</h3>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <i className="bi bi-plus-circle"></i> Add Timeline
          </button>
        </div>

        <div className="card-body" aria-busy={loading}>
          {loading ? (
            <TimelineRowsSkeleton />
          ) : error ? (
            <div className="alert alert-danger">
              <h4>Error Loading Timeline</h4>
              <p>{error}</p>
              <p>Pastikan tabel <code>tbl_timelines</code> sudah disiapkan lewat Supabase SQL Editor.</p>
              <button className="btn btn-primary" onClick={() => void loadTimelines()}>
                <i className="bi bi-arrow-clockwise"></i> Retry
              </button>
            </div>
          ) : timelines.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-calendar-event"></i>
              <p>No timeline entries yet</p>
              <button className="btn btn-primary" onClick={() => openModal()}>
                Add Your First Timeline
              </button>
            </div>
          ) : (
            <div className="timeline-table-wrap">
              <table className="timeline-data-table">
                <thead>
                  <tr>
                    <th scope="col">Year / Period</th>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timelines.map((timeline) => (
                    <tr key={timeline.id}>
                      <td data-label="Year / Period">{timeline.year}</td>
                      <td data-label="Title">{timeline.title}</td>
                      <td data-label="Description">{timeline.description}</td>
                      <td data-label="Actions" className="timeline-actions-cell">
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => openModal(timeline)}
                            title="Edit"
                            aria-label={`Edit ${timeline.title}`}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => void handleDelete(timeline)}
                            title="Delete"
                            aria-label={`Delete ${timeline.title}`}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="modal show timeline-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="timeline-modal-title">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h3 className="modal-title" id="timeline-modal-title">
                  {editingId ? 'Edit Timeline' : 'Add Timeline'}
                </h3>
                <button
                  type="button"
                  className="modal-close"
                  onClick={closeModal}
                  aria-label="Close"
                  disabled={saving}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="timeline-year">Year / Period</label>
                  <input
                    id="timeline-year"
                    type="text"
                    className="form-control"
                    placeholder="e.g., 2019 - 2022"
                    value={formData.year}
                    onChange={(event) => setFormData({ ...formData, year: event.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="timeline-title">Title</label>
                  <input
                    id="timeline-title"
                    type="text"
                    className="form-control"
                    placeholder="e.g., Universitas Binaniaga Indonesia"
                    value={formData.title}
                    onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="timeline-description">Description</label>
                  <textarea
                    id="timeline-description"
                    className="form-control"
                    placeholder="Describe your education or experience..."
                    value={formData.description}
                    onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                    rows={4}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving
                    ? <><i className="bi bi-arrow-repeat"></i> Saving...</>
                    : editingId ? 'Update Timeline' : 'Save Timeline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
