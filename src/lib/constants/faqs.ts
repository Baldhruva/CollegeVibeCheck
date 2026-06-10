/**
 * Responsibility: Static definitions of Frequently Asked Questions.
 * Purpose: Provides structured data for the FAQ section of the application.
 * What code will eventually live here: An array of FAQ objects with questions, answers, and tags.
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "ratings" | "comments" | "account";
}

export const FAQS: FAQItem[] = [
  {
    id: "what-is-cvc",
    category: "general",
    question: "What is CollegeVibeCheck?",
    answer: "CollegeVibeCheck is a platform created to help prospective students understand the true student experience at Mumbai colleges. By aggregating ratings and comments from verified current students, we help you check the 'vibe' of a college before taking admission."
  },
  {
    id: "who-can-rate",
    category: "ratings",
    question: "Who can rate a college?",
    answer: "Only users registered as Students can rate a college, and they can only rate the specific college they belong to. Viewers and anonymous users cannot rate any colleges to maintain rating authenticity."
  },
  {
    id: "how-are-ratings-calculated",
    category: "ratings",
    question: "How are the college ratings calculated?",
    answer: "Each college is rated across 8 major parameters (Academics, Amenities, Social Life, etc.), with each parameter composed of 4 sub-parameters rated from 1 to 5 stars. The overall college rating is the average of all individual user ratings, which in turn are averages of the 8 parameters."
  },
  {
    id: "who-can-comment",
    category: "comments",
    question: "Who can write comments?",
    answer: "Students can create main comments only under their own college. Viewers and students from other colleges can reply to existing comments. Anonymous (unauthenticated) users can read discussions but cannot post comments or replies."
  },
  {
    id: "what-do-badge-colors-mean",
    category: "general",
    question: "What do the user color tags mean in comments?",
    answer: "Green indicates the commenter is a student enrolled in the college currently being viewed. Red indicates the commenter is a student from a different college. Yellow indicates the commenter is registered as a general Viewer."
  },
  {
    id: "can-i-add-my-college",
    category: "general",
    question: "Can I add a new college to the system?",
    answer: "No, college creation is restricted. Only manually pre-seeded Mumbai colleges exist in the system to ensure data quality and avoid duplicates."
  }
];
