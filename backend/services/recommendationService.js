const Student = require('../models/User');
const Event = require('../models/Event');

/**
 * Recommendation Service
 * Implements collaborative and content-based filtering for event recommendations
 */
class RecommendationService {
  
  /**
   * Get personalized event recommendations for a student
   * @param {String} studentId - MongoDB ObjectId of the student
   * @param {Number} limit - Number of recommendations to return
   * @returns {Array} Array of recommended events
   */
  async getRecommendations(studentId, limit = 10) {
    try {
      const student = await Student.findById(studentId).populate('eventHistory.eventId');
      
      if (!student) {
        throw new Error('Student not found');
      }

      // Get all future public events or events where student is invited
      const allEvents = await Event.find({
        date: { $gte: new Date() },
        $or: [
          { isPublic: true },
          { invitedStudents: studentId }
        ]
      }).populate('college');

      // Filter out events student already registered for
      const registeredEventIds = student.eventHistory
        .filter(h => h.action === 'registered')
        .map(h => h.eventId?._id?.toString());

      const unregisteredEvents = allEvents.filter(
        event => !registeredEventIds.includes(event._id.toString())
      );

      // If student has no interests, return popular events
      if (!student.interests || student.interests.length === 0) {
        return unregisteredEvents
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, limit);
      }

      // Calculate scores for each event
      const scoredEvents = unregisteredEvents.map(event => {
        const contentScore = this.calculateContentScore(student, event);
        const collaborativeScore = this.calculateCollaborativeScore(student, event);
        const popularityScore = this.calculatePopularityScore(event);
        
        // Weighted average
        const finalScore = (
          contentScore * 0.5 +
          collaborativeScore * 0.3 +
          popularityScore * 0.2
        );

        return {
          event,
          score: finalScore
        };
      });

      // Sort by score and return top N
      const recommendations = scoredEvents
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.event);

      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Content-based filtering: Match events to student interests
   */
  calculateContentScore(student, event) {
    let score = 0;
    
    // Match event category with student interests
    if (student.interests && student.interests.length > 0) {
      const eventCategoryLower = event.eventCategory?.toLowerCase() || '';
      const eventNameLower = event.eventName?.toLowerCase() || '';
      const matchingInterests = student.interests.filter(interest => {
        const interestLower = interest.toLowerCase();
        return eventCategoryLower.includes(interestLower) ||
               eventNameLower.includes(interestLower) ||
               event.tags?.some(tag => tag.toLowerCase().includes(interestLower));
      });
      
      score += (matchingInterests.length / student.interests.length) * 100;
    }

    // Boost score if event difficulty matches student history
    if (student.eventHistory && student.eventHistory.length > 0) {
      const attendedDifficulties = student.eventHistory
        .filter(h => h.eventId && h.eventId.difficulty)
        .map(h => h.eventId.difficulty);
      
      if (attendedDifficulties.includes(event.difficulty)) {
        score += 20;
      }
    }

    return Math.min(score, 100);
  }

  /**
   * Collaborative filtering: Find similar users and their preferences
   */
  calculateCollaborativeScore(student, event) {
    // Simplified collaborative filtering based on event popularity
    // In a real implementation, this would find similar users
    const participantScore = event.participants ? (event.participants.length * 2) : 0;
    return Math.min(participantScore, 100);
  }

  /**
   * Popularity-based scoring
   */
  calculatePopularityScore(event) {
    const maxViews = 1000;
    const viewScore = Math.min((event.viewCount / maxViews) * 50, 50);
    const ratingScore = (event.averageRating / 5) * 50;
    
    return viewScore + ratingScore;
  }

  /**
   * Get trending events based on recent activity
   */
  async getTrendingEvents(limit = 10) {
    try {
      // Only show public trending events
      const events = await Event.find({
        date: { $gte: new Date() },
        isPublic: true
      })
        .populate('college')
        .sort({ popularity: -1, viewCount: -1, averageRating: -1 })
        .limit(limit);

      return events;
    } catch (error) {
      console.error('Error fetching trending events:', error);
      throw error;
    }
  }

  /**
   * Update event view count and popularity
   */
  async trackEventView(eventId, studentId) {
    try {
      const event = await Event.findById(eventId);
      if (event) {
        event.viewCount += 1;
        event.popularity = this.calculatePopularityMetric(event);
        await event.save();
      }

      // Track in student history
      if (studentId) {
        await Student.findByIdAndUpdate(studentId, {
          $push: {
            eventHistory: {
              eventId: eventId,
              action: 'viewed',
              timestamp: new Date()
            }
          }
        });
      }
    } catch (error) {
      console.error('Error tracking event view:', error);
    }
  }

  /**
   * Calculate popularity metric based on views, registrations, and ratings
   */
  calculatePopularityMetric(event) {
    const viewWeight = 1;
    const registrationWeight = 5;
    const ratingWeight = 10;

    const popularity = (
      (event.viewCount || 0) * viewWeight +
      (event.participants?.length || 0) * registrationWeight +
      (event.averageRating || 0) * ratingWeight
    );

    return popularity;
  }
}

module.exports = new RecommendationService();
