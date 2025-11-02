import { Request, Response, NextFunction } from 'express';

export const validateUserRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { name, username, email, password, portfolio_slug } = req.body;

  if (!name || !username || !email || !password || !portfolio_slug) {
    res.status(400).json({ message: 'All required fields must be provided' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters long' });
    return;
  }

  if (username.length < 3) {
    res.status(400).json({ message: 'Username must be at least 3 characters long' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Please provide a valid email address' });
    return;
  }

  next();
};

export const validateProject = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description, tags, tech_stack } = req.body;

  if (!title || !description) {
    res.status(400).json({ message: 'Title and description are required' });
    return;
  }

  if (title.length > 100) {
    res.status(400).json({ message: 'Title must be less than 100 characters' });
    return;
  }

  if (description.length > 2000) {
    res.status(400).json({ message: 'Description must be less than 2000 characters' });
    return;
  }

  next();
};

export const validateGrant = (req: Request, res: Response, next: NextFunction): void => {
  const { amount, grant_type, project_id } = req.body;

  if (!amount || !grant_type || !project_id) {
    res.status(400).json({ message: 'Amount, grant type, and project ID are required' });
    return;
  }

  if (amount <= 0) {
    res.status(400).json({ message: 'Amount must be greater than 0' });
    return;
  }

  const validGrantTypes = ['development', 'launch', 'scaling', 'research'];
  if (!validGrantTypes.includes(grant_type)) {
    res.status(400).json({ message: 'Invalid grant type' });
    return;
  }

  next();
};

export const validateGrantApplication = (req: Request, res: Response, next: NextFunction): void => {
  const {
    grant_program_id,
    project_id,
    proposal,
    budget_breakdown,
    timeline,
    expected_impact,
    team_details,
    project_overview,
    roadmap,
    vision_impact,
    why_grant,
    pitch_video_url,
    presentation_url,
    women_leadership_percentage,
    working_prototype,
    progress_duration_months
  } = req.body;

  // Required fields validation
  if (!grant_program_id || !project_id || !proposal || !budget_breakdown || !timeline || !expected_impact) {
    res.status(400).json({ message: 'Missing required fields: grant_program_id, project_id, proposal, budget_breakdown, timeline, expected_impact' });
    return;
  }

  if (!team_details || !project_overview || !roadmap || !vision_impact || !why_grant) {
    res.status(400).json({ message: 'Missing required fields: team_details, project_overview, roadmap, vision_impact, why_grant' });
    return;
  }

  if (!pitch_video_url || !presentation_url) {
    res.status(400).json({ message: 'Missing required fields: pitch_video_url, presentation_url' });
    return;
  }

  // Field length validation
  if (proposal.length < 100) {
    res.status(400).json({ message: 'Proposal must be at least 100 characters long' });
    return;
  }

  if (proposal.length > 5000) {
    res.status(400).json({ message: 'Proposal must be less than 5000 characters' });
    return;
  }

  if (budget_breakdown.length < 50) {
    res.status(400).json({ message: 'Budget breakdown must be at least 50 characters long' });
    return;
  }

  if (timeline.length < 20) {
    res.status(400).json({ message: 'Timeline must be at least 20 characters long' });
    return;
  }

  // Numeric validation
  if (typeof women_leadership_percentage !== 'number' || women_leadership_percentage < 0 || women_leadership_percentage > 100) {
    res.status(400).json({ message: 'Women leadership percentage must be a number between 0 and 100' });
    return;
  }

  if (typeof progress_duration_months !== 'number' || progress_duration_months < 0) {
    res.status(400).json({ message: 'Progress duration must be a positive number' });
    return;
  }

  if (typeof working_prototype !== 'boolean') {
    res.status(400).json({ message: 'Working prototype must be a boolean value' });
    return;
  }

  // URL validation
  const urlRegex = /^https?:\/\/.+/;
  if (!urlRegex.test(pitch_video_url)) {
    res.status(400).json({ message: 'Pitch video URL must be a valid URL' });
    return;
  }

  if (!urlRegex.test(presentation_url)) {
    res.status(400).json({ message: 'Presentation URL must be a valid URL' });
    return;
  }

  next();
};

export const validateChallenge = (req: Request, res: Response, next: NextFunction): void => {
  const { title, theme, duration, start_date, end_date, rules, submission_requirements } = req.body;

  if (!title || !theme || !duration || !start_date || !end_date) {
    res.status(400).json({ message: 'All required fields must be provided' });
    return;
  }

  if (duration < 1) {
    res.status(400).json({ message: 'Duration must be at least 1 day' });
    return;
  }

  if (new Date(start_date) >= new Date(end_date)) {
    res.status(400).json({ message: 'End date must be after start date' });
    return;
  }

  if (!rules || rules.length === 0) {
    res.status(400).json({ message: 'At least one rule is required' });
    return;
  }

  if (!submission_requirements || submission_requirements.length === 0) {
    res.status(400).json({ message: 'At least one submission requirement is required' });
    return;
  }

  next();
};

export const validateProgressLog = (req: Request, res: Response, next: NextFunction): void => {
  const { content, project_id } = req.body;

  if (!content || !project_id) {
    res.status(400).json({ message: 'Content and project ID are required' });
    return;
  }

  if (content.length > 5000) {
    res.status(400).json({ message: 'Content must be less than 5000 characters' });
    return;
  }

  next();
}; 