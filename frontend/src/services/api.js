const API_BASE = '/api';

export async function fetchFeed() {
  const response = await fetch(`${API_BASE}/feed`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch profiles');
  }

  return response.json();
}

export async function submitSwipe(targetId, action) {
  const response = await fetch(`${API_BASE}/swipe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ targetId, action })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.error || 'Failed to submit swipe');
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function fetchMatches() {
  const response = await fetch(`${API_BASE}/matches`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch matches');
  }

  return response.json();
}

export async function resetDatabase() {
  const response = await fetch(`${API_BASE}/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to reset database');
  }

  return response.json();
}
