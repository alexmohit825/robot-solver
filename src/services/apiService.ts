import { Review, ResponseDraft, DisputeCase, ReShareCampaign, ExtensionActionPayload, AutopilotConfig, AutopilotActivityLog } from '../types/reputation';
import { INITIAL_REVIEWS, INITIAL_AUTOPILOT_CONFIG, INITIAL_ACTIVITY_LOGS } from '../data/mockReviews';
import { AiEngine } from './aiEngine';

export class ApiService {
  private static reviews: Review[] = [...INITIAL_REVIEWS];
  private static disputes: DisputeCase[] = [];
  private static campaigns: ReShareCampaign[] = [];
  private static extensionQueue: ExtensionActionPayload[] = [];
  private static autopilotConfig: AutopilotConfig = { ...INITIAL_AUTOPILOT_CONFIG };
  private static activityLogs: AutopilotActivityLog[] = [...INITIAL_ACTIVITY_LOGS];

  // ===================== REVIEWS API =====================

  static async getReviews(): Promise<Review[]> {
    await new Promise(r => setTimeout(r, 200));
    return [...this.reviews];
  }

  static async getReviewById(id: string): Promise<Review | undefined> {
    await new Promise(r => setTimeout(r, 100));
    return this.reviews.find(r => r.id === id);
  }

  static async generateDrafts(reviewId: string, customNotes?: string): Promise<ResponseDraft[]> {
    await new Promise(r => setTimeout(r, 400));
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review) throw new Error('Review not found');
    return AiEngine.generateResponseDrafts(review, customNotes);
  }

  static async publishResponse(
    reviewId: string, 
    draftText: string, 
    method: 'DIRECT_API' | 'COMPANION_EXTENSION' | 'MANUAL'
  ): Promise<{ success: boolean; status: string; extensionPayload?: ExtensionActionPayload }> {
    await new Promise(r => setTimeout(r, 600));
    const index = this.reviews.findIndex(r => r.id === reviewId);
    if (index === -1) throw new Error('Review not found');

    const review = this.reviews[index];
    
    if (method === 'DIRECT_API') {
      this.reviews[index] = {
        ...review,
        status: 'PUBLISHED',
        existingResponse: {
          text: draftText,
          publishedAt: new Date().toISOString(),
          publishedVia: 'DIRECT_API'
        }
      };

      this.activityLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'AUTO_PUBLISH',
        title: `Response Published to ${review.platform}`,
        description: `Physician reply published directly via API for review by ${review.authorName}.`,
        status: 'SUCCESS',
        platform: review.platform
      });

      return { success: true, status: 'PUBLISHED_DIRECTLY' };
    } else {
      const payload: ExtensionActionPayload = {
        actionId: `act-${Date.now()}`,
        actionType: 'FILL_REPLY',
        targetPlatform: review.platform,
        targetUrl: `https://${review.platform.toLowerCase()}.com/physician/reviews/${review.platformReviewId}`,
        authorName: review.authorName,
        reviewSnippet: review.reviewText.slice(0, 60) + '...',
        textToInject: draftText,
        status: 'QUEUED'
      };

      this.extensionQueue.push(payload);
      this.reviews[index] = {
        ...review,
        status: 'DRAFTED',
        existingResponse: {
          text: draftText,
          publishedAt: new Date().toISOString(),
          publishedVia: 'COMPANION_EXTENSION'
        }
      };

      return {
        success: true,
        status: 'QUEUED_FOR_EXTENSION',
        extensionPayload: payload
      };
    }
  }

  static async addInternalNote(reviewId: string, note: string): Promise<Review> {
    const index = this.reviews.findIndex(r => r.id === reviewId);
    if (index === -1) throw new Error('Review not found');

    const existingNotes = this.reviews[index].internalNotes || [];
    this.reviews[index] = {
      ...this.reviews[index],
      internalNotes: [...existingNotes, note]
    };
    return this.reviews[index];
  }

  // ===================== DISPUTES & TAKEDOWN API =====================

  static async analyzeViolations(reviewId: string): Promise<DisputeCase> {
    await new Promise(r => setTimeout(r, 450));
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review) throw new Error('Review not found');

    const violations = AiEngine.analyzeTosViolations(review);
    const disputeCase = AiEngine.buildDisputeDossier(review, violations);
    
    const existingIndex = this.disputes.findIndex(d => d.reviewId === reviewId);
    if (existingIndex >= 0) {
      this.disputes[existingIndex] = disputeCase;
    } else {
      this.disputes.push(disputeCase);
    }

    return disputeCase;
  }

  static async submitDispute(disputeId: string): Promise<{ success: boolean; dispute: DisputeCase; extensionPayload?: ExtensionActionPayload }> {
    await new Promise(r => setTimeout(r, 600));
    const index = this.disputes.findIndex(d => d.id === disputeId);
    if (index === -1) throw new Error('Dispute case not found');

    const dispute = this.disputes[index];
    dispute.status = 'SUBMITTED';
    dispute.submittedAt = new Date().toISOString();

    const reviewIndex = this.reviews.findIndex(r => r.id === dispute.reviewId);
    if (reviewIndex >= 0) {
      this.reviews[reviewIndex].status = 'DISPUTE_IN_PROGRESS';
    }

    let extensionPayload: ExtensionActionPayload | undefined;
    if (dispute.platform !== 'GOOGLE') {
      extensionPayload = {
        actionId: `dsp-act-${Date.now()}`,
        actionType: 'FILL_DISPUTE',
        targetPlatform: dispute.platform,
        targetUrl: `https://${dispute.platform.toLowerCase()}.com/takedown/dispute-form`,
        authorName: this.reviews[reviewIndex]?.authorName || 'Reviewer',
        reviewSnippet: dispute.appealDossier.subject,
        textToInject: dispute.appealDossier.formalStatement,
        status: 'QUEUED'
      };
      this.extensionQueue.push(extensionPayload);
    }

    this.activityLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'AUTO_DISPUTE',
      title: `Formal Dispute Petition Dispatched (${dispute.platform})`,
      description: `Dispute filed citing platform Terms of Service for Review #${dispute.reviewId}.`,
      status: 'SUCCESS',
      platform: dispute.platform
    });

    return { success: true, dispute, extensionPayload };
  }

  static async getDisputes(): Promise<DisputeCase[]> {
    return [...this.disputes];
  }

  // ===================== AMPLIFICATION & RE-SHARE API =====================

  static async sendReShareCampaign(campaign: Omit<ReShareCampaign, 'id' | 'status' | 'sentAt'>): Promise<ReShareCampaign> {
    await new Promise(r => setTimeout(r, 500));
    const newCampaign: ReShareCampaign = {
      ...campaign,
      id: `cmp-${Date.now()}`,
      status: 'SENT',
      sentAt: new Date().toISOString()
    };
    this.campaigns.push(newCampaign);

    const revIndex = this.reviews.findIndex(r => r.id === campaign.reviewId);
    if (revIndex >= 0) {
      this.reviews[revIndex].status = 'AMPLIFIED';
    }

    this.activityLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'AUTO_RESHARE',
      title: `1-Click Re-Share SMS Sent to ${campaign.recipientName}`,
      description: `Dispatched Healthgrades boost magic link for 5-star clinical review.`,
      status: 'SUCCESS'
    });

    return newCampaign;
  }

  static async getCampaigns(): Promise<ReShareCampaign[]> {
    return [...this.campaigns];
  }

  // ===================== AUTOPILOT & BACKGROUND API =====================

  static async getAutopilotConfig(): Promise<AutopilotConfig> {
    return { ...this.autopilotConfig };
  }

  static async updateAutopilotConfig(config: Partial<AutopilotConfig>): Promise<AutopilotConfig> {
    this.autopilotConfig = { ...this.autopilotConfig, ...config };
    return { ...this.autopilotConfig };
  }

  static async getActivityLogs(): Promise<AutopilotActivityLog[]> {
    return [...this.activityLogs];
  }

  static async triggerBackgroundScan(): Promise<{ newReviewsFound: number; logs: AutopilotActivityLog[] }> {
    await new Promise(r => setTimeout(r, 1200));
    const newLog: AutopilotActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'CRAWL_SYNC',
      title: 'Manual Background Scan Completed',
      description: 'Crawled Google, Healthgrades, Yelp, RateMDs, Vitals. All 248 reviews synced with 0 anomalies.',
      status: 'SUCCESS'
    };
    this.activityLogs.unshift(newLog);
    return { newReviewsFound: 0, logs: [...this.activityLogs] };
  }

  static async executeSmsQuickAction(actionNumber: '1' | '2' | '3', reviewId: string): Promise<{ success: boolean; message: string }> {
    await new Promise(r => setTimeout(r, 500));
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review) return { success: false, message: 'Review not found' };

    if (actionNumber === '1') {
      // 1: Publish AI Draft to Google
      const drafts = AiEngine.generateResponseDrafts(review);
      const text = drafts[0].content;
      await this.publishResponse(review.id, text, 'DIRECT_API');
      return { success: true, message: `Action 1 Executed: Approved reply published to ${review.platform} directly via API.` };
    } else if (actionNumber === '2') {
      // 2: Escalate to Practice Manager
      await this.addInternalNote(review.id, 'Escalated via SMS Quick Action: Practice Manager instructed to review patient intake.');
      return { success: true, message: 'Action 2 Executed: Review escalated to MultiCare Practice Administration.' };
    } else {
      // 3: File ToS Dispute
      const violations = AiEngine.analyzeTosViolations(review);
      const dispute = AiEngine.buildDisputeDossier(review, violations);
      this.disputes.push(dispute);
      await this.submitDispute(dispute.id);
      return { success: true, message: `Action 3 Executed: Legalistic ToS takedown petition filed with ${review.platform}.` };
    }
  }

  // ===================== EXTENSION API =====================

  static getExtensionQueue(): ExtensionActionPayload[] {
    return [...this.extensionQueue];
  }

  static completeExtensionAction(actionId: string): void {
    this.extensionQueue = this.extensionQueue.filter(a => a.actionId !== actionId);
  }
}
