// Single-attempt guard for Student CBT.
//
// Rule:
// - A student may (re)open a test as many times as needed BEFORE submitting
//   (this is what lets them continue after a power outage / network drop).
// - The moment a submit succeeds (manual, timer auto-submit, or cheat
//   auto-submit), the test is locked for that student and can never be
//   taken again — even via a direct URL.
//
// Storage is per-student + per-test so two students sharing one device
// don't block each other:
//   cbt_submitted_<studentUid>_<testId> = { at: ISO timestamp }
// Backend flags (if the API ever returns them) are honoured too.

export function getStudentUid() {
    try {
        const raw = localStorage.getItem("user");
        if (!raw) return "";
        const u = JSON.parse(raw);
        return (
            u?.studentId ||
            u?.registrationId ||
            u?.matricNo ||
            u?.id ||
            u?._id ||
            ""
        );
    } catch {
        return "";
    }
}

export function submittedStorageKey(testId) {
    const uid = getStudentUid() || "anon";
    return `cbt_submitted_${uid}_${testId}`;
}

/** True if THIS student already submitted THIS test on this device. */
export function isTestSubmittedLocally(testId) {
    if (!testId) return false;
    try {
        return !!localStorage.getItem(submittedStorageKey(testId));
    } catch {
        return false;
    }
}

/** Lock THIS student out of THIS test (call only after a confirmed submit). */
export function markTestSubmitted(testId) {
    if (!testId) return;
    try {
        localStorage.setItem(
            submittedStorageKey(testId),
            JSON.stringify({ at: new Date().toISOString() })
        );
    } catch {
        // storage full/blocked — backend + in-memory guards still apply
    }
}

/**
 * True if the backend record itself says this student already took it.
 * Checks every flag name the API might use, so we stay compatible even
 * if the backend adds a `hasSubmitted`-style field later.
 */
export function isTestSubmittedByRecord(test) {
    if (!test || typeof test !== "object") return false;
    if (
        test.hasSubmitted === true ||
        test.submitted === true ||
        test.isSubmitted === true ||
        test.hasAttempted === true ||
        test.attempted === true ||
        test.hasTaken === true ||
        test.taken === true
    ) {
        return true;
    }
    const count = test.attemptCount ?? test.attemptsCount ?? test.submissionCount;
    if (typeof count === "number" && count > 0) return true;
    if (Array.isArray(test.attempts) && test.attempts.length > 0) return true;
    if (Array.isArray(test.submissions) && test.submissions.length > 0) return true;
    return false;
}

/** Combined check: backend record OR this device's submit lock. */
export function isTestSubmitted(test) {
    if (!test || typeof test !== "object") return false;
    if (isTestSubmittedByRecord(test)) return true;
    return isTestSubmittedLocally(test._id || test.id);
}

/** Backend "duplicate submit" messages -> treat as already-submitted. */
export function isAlreadySubmittedMessage(message) {
    if (!message || typeof message !== "string") return false;
    return /already\s*submitt|already\s*taken|already\s*attempt|multiple\s*attempt|not\s*allowed.*(again|retake|resubmit)|cannot.*(again|retake|resubmit)|one\s*attempt|single\s*attempt/i.test(
        message
    );
}
