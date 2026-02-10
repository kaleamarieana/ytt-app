# Yoga Teacher Training Study App

## Capstone Project Scope

### Project Goal
Build an all-in-one yoga learning app that helps users memorize pose names in English and Sanskrit, learn breath timing for transitions, and practice teaching cues through swipe-based flashcards.

### Primary Users
- Yoga teacher trainees preparing for exams and practicums.
- Self-learners who want guided pose study and recall practice.

### Problem Statement
Yoga learners often memorize pose shapes separately from names, Sanskrit terms, and breath timing. This creates gaps when teaching or sequencing classes. The app solves this by combining all learning elements in one flashcard workflow.

## Success Criteria
- Users can study and recall pose names in English and Sanskrit.
- Users can identify whether to inhale, exhale, or hold while entering/exiting poses.
- Users can study pose-specific teaching cues for different student needs.
- Users can swipe through all poses or filtered subcategories without friction.

## Functional Requirements

### MVP Features (Phase 1)
1. Flashcard Viewer
- Show one pose at a time.
- Swipe left/right to navigate.
- Optional flip action to reveal extra details.

2. Pose Card Content
- English pose name.
- Sanskrit pose name.
- Category (standing, seated, twist, etc.).
- Breath timing for `enter`, `hold` (optional), and `exit`.
- One clear pose image.
- Alignment cues.
- Teaching cues by learner type.

3. Category Filtering
- User can filter cards by at least one category.
- User can reset to all poses.

4. Study Mode
- Full card content visible by default.
- Designed for guided learning.

5. Quiz Mode
- Hide one or more fields (for example Sanskrit or breath cue).
- Tap to reveal answer.
- Next/previous navigation preserved.

### Phase 2 Features
1. Progress tracking (known vs needs review).
2. Favorite and bookmark difficult poses.
3. Sanskrit pronunciation audio.
4. Spaced repetition review queue.
5. Sequence builder for class planning.

## Non-Functional Requirements
- Mobile-first responsive layout.
- Fast card rendering and smooth swipe interactions.
- Accessible typography and contrast.
- Keyboard navigation support on desktop.
- Data stored in structured JSON for easy expansion.

## Data Requirements
Each pose record should include:
- `id`
- `englishName`
- `sanskritName`
- `category`
- `difficulty`
- `breath.enter`
- `breath.hold` (optional)
- `breath.exit`
- `alignmentCues[]`
- `teachingCues.general[]`
- `teachingCues.beginner[]`
- `teachingCues.limitedMobility[]`
- `commonMistakes[]`
- `image.filename`
- `image.prompt`

## Milestones (6-Week Example)
1. Week 1: Finalize requirements, data schema, and content list.
2. Week 2: Build flashcard UI and swipe interactions.
3. Week 3: Integrate pose dataset and card rendering.
4. Week 4: Implement category filters and quiz mode.
5. Week 5: UX polish, testing, and bug fixes.
6. Week 6: Final report, slides, and demo walkthrough.

## Deliverables
1. Functional web app prototype.
2. Structured pose dataset.
3. Technical capstone report (problem, approach, outcomes, limitations).
4. Presentation slides and live or recorded demo.

## Acceptance Checklist
- User can browse all cards without errors.
- At least 20 poses include complete flashcard fields.
- Category filters and quiz mode are functional.
- Breath guidance is visible and consistent per card.
- Teaching cues are present for at least two learner profiles.
