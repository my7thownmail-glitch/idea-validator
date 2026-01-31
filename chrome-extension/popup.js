// Configuration
const API_URL = 'https://mpwpwjmbrommclrzoyel.supabase.co/functions/v1/validate-idea';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wd3B3am1icm9tbWNscnpveWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NTA2MjIsImV4cCI6MjA4NTQyNjYyMn0.FFCK46OrDLPQbw54zttR8N56DjfBqolbvaUxQn0sRdE';
const MAX_HISTORY = 5;

// DOM Elements
const form = document.getElementById('validator-form');
const ideaInput = document.getElementById('idea-input');
const platformSelect = document.getElementById('platform-select');
const contentTypeSelect = document.getElementById('content-type');
const audienceLevelSelect = document.getElementById('audience-level');
const goalSelect = document.getElementById('goal-select');
const trendAwarenessCheckbox = document.getElementById('trend-awareness');
const validateBtn = document.getElementById('validate-btn');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');
const errorMessage = document.getElementById('error-message');
const results = document.getElementById('results');
const copyBtn = document.getElementById('copy-btn');
const newBtn = document.getElementById('new-btn');
const historyList = document.getElementById('history-list');

let currentResult = null;

// Platform mapping
const platformMap = {
  'youtube.com': 'youtube-shorts',
  'www.youtube.com': 'youtube-shorts',
  'tiktok.com': 'tiktok',
  'www.tiktok.com': 'tiktok',
  'instagram.com': 'instagram-reels',
  'www.instagram.com': 'instagram-reels',
  'twitter.com': 'x',
  'www.twitter.com': 'x',
  'x.com': 'x',
  'www.x.com': 'x',
  'linkedin.com': 'linkedin',
  'www.linkedin.com': 'linkedin'
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadHistory();
  await checkForSelectedText();
  await detectPlatform();
});

// Check for selected text from context menu
async function checkForSelectedText() {
  try {
    const data = await chrome.storage.local.get(['selectedText', 'detectedPlatform']);
    if (data.selectedText) {
      ideaInput.value = data.selectedText;
      await chrome.storage.local.remove(['selectedText']);
    }
    if (data.detectedPlatform) {
      platformSelect.value = data.detectedPlatform;
      await chrome.storage.local.remove(['detectedPlatform']);
    }
  } catch (e) {
    console.log('No selected text');
  }
}

// Detect platform from active tab
async function detectPlatform() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      const url = new URL(tab.url);
      const platform = platformMap[url.hostname];
      if (platform && !ideaInput.value) {
        platformSelect.value = platform;
      }
    }
  } catch (e) {
    console.log('Could not detect platform');
  }
}

// Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const idea = ideaInput.value.trim();
  if (!idea) {
    showError('Please enter a content idea');
    return;
  }

  await validateIdea({
    idea,
    platform: platformSelect.value,
    contentType: contentTypeSelect.value,
    audienceLevel: audienceLevelSelect.value,
    goal: goalSelect.value,
    trendAwareness: trendAwarenessCheckbox.checked
  });
});

// Validate idea
async function validateIdea(data) {
  setLoading(true);
  hideError();
  hideResults();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.scores || !result.verdict || !result.finalRecommendation) {
      throw new Error('Invalid response from AI');
    }

    currentResult = result;
    displayResults(result, data.trendAwareness);
    await saveToHistory(data.idea, result, data.platform);

  } catch (error) {
    showError(error.message || 'Failed to validate idea. Please try again.');
  } finally {
    setLoading(false);
  }
}

// Display results
function displayResults(result, showTrend) {
  // Scores
  updateScore('virality-score', result.scores.viralityPotential);
  updateScore('originality-score', result.scores.originality);
  updateScore('saturation-score', 100 - result.scores.saturationRisk);
  updateScore('execution-score', 100 - result.scores.executionDifficulty);

  // Verdict
  document.getElementById('verdict-text').textContent = result.verdict;

  // Recommendation
  const recBadge = document.getElementById('recommendation-badge');
  const recConfig = {
    'publish': { label: '✓ Publish as-is', class: 'publish' },
    'publish-with-changes': { label: '⚠ Publish after changes', class: 'publish-with-changes' },
    'drop': { label: '✗ Drop this idea', class: 'drop' }
  };
  const rec = recConfig[result.finalRecommendation];
  recBadge.textContent = rec.label;
  recBadge.className = `recommendation-badge ${rec.class}`;

  // Hook Strength
  if (result.hookAnalysis) {
    document.getElementById('hook-type').textContent = `Type: ${capitalizeFirst(result.hookAnalysis.detectedHookType)}`;
    document.getElementById('hook-score').textContent = result.hookAnalysis.hookStrengthScore;
    document.getElementById('hook-progress').style.width = `${result.hookAnalysis.hookStrengthScore}%`;
    document.getElementById('hook-verdict').textContent = getHookVerdict(result.hookAnalysis.hookStrengthScore);
    renderList('hook-explanations', result.hookAnalysis.strengthExplanation);
    document.getElementById('hook-improved').textContent = `"${result.hookAnalysis.improvedHookExample}"`;
  }

  // Effort vs Reward
  if (result.effortRewardAnalysis) {
    document.getElementById('effort-progress').style.width = `${result.effortRewardAnalysis.effortScore}%`;
    document.getElementById('effort-value').textContent = result.effortRewardAnalysis.effortScore;
    document.getElementById('reward-progress').style.width = `${result.effortRewardAnalysis.rewardScore}%`;
    document.getElementById('reward-value').textContent = result.effortRewardAnalysis.rewardScore;
    
    const verdictEl = document.getElementById('effort-verdict');
    const verdictConfig = {
      'worth-it': { label: 'Worth it', class: 'worth-it' },
      'risky': { label: 'Risky', class: 'risky' },
      'not-worth-it': { label: 'Not worth the effort', class: 'not-worth-it' }
    };
    const verdict = verdictConfig[result.effortRewardAnalysis.ratioVerdict] || verdictConfig['risky'];
    verdictEl.textContent = verdict.label;
    verdictEl.className = `effort-verdict ${verdict.class}`;
  }

  // Series Potential
  if (result.seriesPotentialAnalysis) {
    const seriesBadge = document.getElementById('series-badge');
    seriesBadge.textContent = capitalizeFirst(result.seriesPotentialAnalysis.seriesPotential);
    seriesBadge.className = `series-badge ${result.seriesPotentialAnalysis.seriesPotential}`;
    
    const seriesAngle = document.getElementById('series-angle');
    const seriesIdeas = document.getElementById('series-ideas');
    
    if (result.seriesPotentialAnalysis.seriesPotential !== 'low' && result.seriesPotentialAnalysis.suggestedSeriesAngle) {
      seriesAngle.textContent = result.seriesPotentialAnalysis.suggestedSeriesAngle;
      seriesAngle.classList.remove('hidden');
      
      if (result.seriesPotentialAnalysis.episodeIdeas?.length) {
        renderList('series-ideas', result.seriesPotentialAnalysis.episodeIdeas);
        seriesIdeas.classList.remove('hidden');
      } else {
        seriesIdeas.classList.add('hidden');
      }
    } else {
      seriesAngle.classList.add('hidden');
      seriesIdeas.classList.add('hidden');
    }
  }

  // Trend Analysis
  const trendSection = document.getElementById('trend-section');
  if (showTrend && result.trendAnalysis) {
    trendSection.classList.remove('hidden');
    
    const statusBadge = document.getElementById('trend-status-badge');
    const statusConfig = {
      'rising': '↑ Rising',
      'peaked': '— Peaked',
      'declining': '↓ Declining',
      'evergreen': '∞ Evergreen'
    };
    statusBadge.textContent = statusConfig[result.trendAnalysis.trendStatus];
    statusBadge.className = `trend-status-badge ${result.trendAnalysis.trendStatus}`;
    
    document.getElementById('trend-saturation').textContent = result.trendAnalysis.trendSaturation;
    document.getElementById('trend-timing').textContent = result.trendAnalysis.timingEffectiveness;
    document.getElementById('trend-insight').textContent = result.trendAnalysis.trendInsight;
    
    const warningCard = document.getElementById('trend-warning-card');
    if (result.trendAnalysis.trendRiskWarning) {
      document.getElementById('trend-warning').textContent = result.trendAnalysis.trendRiskWarning;
      warningCard.classList.remove('hidden');
    } else {
      warningCard.classList.add('hidden');
    }
    
    renderList('trend-advice', result.trendAnalysis.trendAdjustedAdvice);
  } else {
    trendSection.classList.add('hidden');
  }

  // Why May Fail/Win
  renderList('may-fail', result.whyMayFailOrWin.mayFail);
  renderList('may-win', result.whyMayFailOrWin.mayWin);

  // Fix Suggestions
  renderList('hook-improvements', result.fixSuggestions.hookImprovements);
  renderList('angle-changes', result.fixSuggestions.angleChanges);
  renderList('platform-suggestions', result.fixSuggestions.platformSuggestions);

  results.classList.remove('hidden');
}

// Helper functions
function updateScore(id, score) {
  const card = document.getElementById(id);
  const valueEl = card.querySelector('.score-value');
  valueEl.textContent = score;
  valueEl.className = `score-value ${getScoreClass(score)}`;
}

function getScoreClass(score) {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function getHookVerdict(score) {
  if (score >= 70) return 'Strong hook — likely to stop scrollers.';
  if (score >= 40) return 'Decent hook — needs refinement.';
  return 'Weak hook — most viewers will scroll past.';
}

function renderList(id, items) {
  const el = document.getElementById(id);
  el.innerHTML = items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function setLoading(loading) {
  validateBtn.disabled = loading;
  btnText.classList.toggle('hidden', loading);
  btnLoading.classList.toggle('hidden', !loading);
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

function hideError() {
  errorMessage.classList.add('hidden');
}

function hideResults() {
  results.classList.add('hidden');
}

// Copy feedback
copyBtn.addEventListener('click', () => {
  if (!currentResult) return;

  const text = formatResultsAsText(currentResult);
  navigator.clipboard.writeText(text).then(() => {
    copyBtn.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Copied!
    `;
    setTimeout(() => {
      copyBtn.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copy Feedback
      `;
    }, 2000);
  });
});

function formatResultsAsText(result) {
  let text = `=== AI Content Idea Validator ===\n\n`;
  text += `SCORES:\n`;
  text += `• Virality: ${result.scores.viralityPotential}/100\n`;
  text += `• Originality: ${result.scores.originality}/100\n`;
  text += `• Saturation Risk: ${result.scores.saturationRisk}/100\n`;
  text += `• Execution Difficulty: ${result.scores.executionDifficulty}/100\n\n`;
  text += `VERDICT:\n${result.verdict}\n\n`;
  text += `RECOMMENDATION: ${result.finalRecommendation.toUpperCase()}\n\n`;
  
  if (result.hookAnalysis) {
    text += `HOOK STRENGTH: ${result.hookAnalysis.hookStrengthScore}/100 (${result.hookAnalysis.detectedHookType})\n`;
    text += `Improved: "${result.hookAnalysis.improvedHookExample}"\n\n`;
  }
  
  if (result.effortRewardAnalysis) {
    text += `EFFORT VS REWARD: ${result.effortRewardAnalysis.ratioVerdict}\n`;
    text += `• Effort: ${result.effortRewardAnalysis.effortScore}/100\n`;
    text += `• Reward: ${result.effortRewardAnalysis.rewardScore}/100\n\n`;
  }
  
  text += `WHY IT MAY FAIL:\n${result.whyMayFailOrWin.mayFail.map(r => `• ${r}`).join('\n')}\n\n`;
  text += `WHY IT MAY WIN:\n${result.whyMayFailOrWin.mayWin.map(r => `• ${r}`).join('\n')}\n\n`;
  
  text += `FIX SUGGESTIONS:\n`;
  text += `Hook: ${result.fixSuggestions.hookImprovements.join('; ')}\n`;
  text += `Angle: ${result.fixSuggestions.angleChanges.join('; ')}\n`;
  
  return text;
}

// New idea
newBtn.addEventListener('click', () => {
  ideaInput.value = '';
  hideResults();
  hideError();
  currentResult = null;
  ideaInput.focus();
});

// History
async function loadHistory() {
  try {
    const data = await chrome.storage.local.get(['validationHistory']);
    const history = data.validationHistory || [];
    renderHistory(history);
  } catch (e) {
    console.log('Could not load history');
  }
}

async function saveToHistory(idea, result, platform) {
  try {
    const data = await chrome.storage.local.get(['validationHistory']);
    let history = data.validationHistory || [];
    
    history.unshift({
      idea: idea.substring(0, 100),
      platform,
      recommendation: result.finalRecommendation,
      timestamp: Date.now()
    });
    
    history = history.slice(0, MAX_HISTORY);
    
    await chrome.storage.local.set({ validationHistory: history });
    renderHistory(history);
  } catch (e) {
    console.log('Could not save to history');
  }
}

function renderHistory(history) {
  if (!history.length) {
    historyList.innerHTML = '<div class="history-empty">No recent validations</div>';
    return;
  }

  historyList.innerHTML = history.map(item => `
    <div class="history-item" data-idea="${escapeHtml(item.idea)}">
      <div class="history-item-text">${escapeHtml(item.idea)}</div>
      <div class="history-item-meta">
        <span>${item.platform}</span>
        <span>${formatTime(item.timestamp)}</span>
      </div>
    </div>
  `).join('');

  historyList.querySelectorAll('.history-item').forEach(el => {
    el.addEventListener('click', () => {
      ideaInput.value = el.dataset.idea;
      hideResults();
    });
  });
}

function formatTime(timestamp) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
