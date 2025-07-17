// Analytics Service for tracking and reporting
class AnalyticsService {
  constructor() {
    this.database = database;
  }

  // Track user events
  async trackUserEvent(event, data) {
    try {
      await this.database.insert('user_events_audiobooksmith', {
        event_type: event,
        user_id: data.userId,
        metadata: data,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking user event:', error);
    }
  }

  // Track project events
  async trackProjectEvent(event, data) {
    try {
      await this.database.insert('project_events_audiobooksmith', {
        event_type: event,
        project_id: data.projectId,
        user_id: data.userId,
        metadata: data,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking project event:', error);
    }
  }

  // Track revenue events
  async trackRevenueEvent(event, data) {
    try {
      await this.database.insert('revenue_events_audiobooksmith', {
        event_type: event,
        amount: data.amount,
        user_id: data.userId,
        metadata: data,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking revenue event:', error);
    }
  }

  // Calculate key metrics
  async calculateMetrics(timeRange = '7d') {
    try {
      const { data: metrics } = await this.database.select('analytics_audiobooksmith', {
        timeRange,
        select: '*'
      });

      return {
        userMetrics: this.processUserMetrics(metrics),
        revenueMetrics: this.processRevenueMetrics(metrics),
        projectMetrics: this.processProjectMetrics(metrics)
      };
    } catch (error) {
      console.error('Error calculating metrics:', error);
      return null;
    }
  }

  // Process user metrics
  processUserMetrics(data) {
    return {
      totalUsers: data.total_users || 0,
      activeUsers: data.active_users || 0,
      userGrowth: data.user_growth || 0,
      retentionRate: data.retention_rate || 0
    };
  }

  // Process revenue metrics
  processRevenueMetrics(data) {
    return {
      totalRevenue: data.total_revenue || 0,
      revenueGrowth: data.revenue_growth || 0,
      averageOrderValue: data.avg_order_value || 0,
      recurringRevenue: data.recurring_revenue || 0
    };
  }

  // Process project metrics
  processProjectMetrics(data) {
    return {
      totalProjects: data.total_projects || 0,
      projectGrowth: data.project_growth || 0,
      averageProcessingTime: data.avg_processing_time || 0,
      completionRate: data.completion_rate || 0
    };
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;