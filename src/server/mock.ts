import { serializeStatement } from '../shared/openui/serialize.js';
import type { RequestData, Turn } from '../shared/contracts.js';
import { ScreenDocument } from '../shared/openui/document.js';

const WORKOUT_SCREENS = [
  's_welcome',
  's_warmup',
  's_r1_intro',
  's_r1_squats',
  's_r1_pushups',
  's_r1_highknees',
  's_rest',
  's_r2_intro',
  's_r2_squats',
  's_r2_pushups',
  's_r2_highknees',
  's_done',
] as const;

type WorkoutScreen = (typeof WORKOUT_SCREENS)[number];

const ENERGIZE_DOC = `root = Screens([s_welcome, s_warmup, s_r1_intro, s_r1_squats, s_r1_pushups, s_r1_highknees, s_rest, s_r2_intro, s_r2_squats, s_r2_pushups, s_r2_highknees, s_done], s_welcome)
s_welcome = Screen([w_title, w_desc, w_list, w_cue, w_followups])
w_title = Text("ENERGIZE", "title")
w_desc = Text("A 6-minute bodyweight circuit. No gear. No excuses.", "description")
w_list = List([w_li_warmup, w_li_round, w_li_rest])
w_li_warmup = ListItem("Warmup · 45 seconds", "plus")
w_li_round = ListItem("2 rounds · Squats, Push-Ups, High Knees · 40s each", "plus")
w_li_rest = ListItem("60-second rest between rounds", "plus")
w_cue = Cue("Welcome to ENERGIZE. I'll guide you through every step. Tap Let's go when you're ready.")
w_followups = FollowUps(["Let's go!", "What is this workout?", "I'm a beginner"])
s_warmup = Screen([wm_title, wm_sub, wm_video, wm_timer, wm_alert, wm_cue, wm_followups])
wm_title = Text("Get Moving", "title")
wm_sub = Text("45-second warmup", "subtitle")
wm_video = Video("/exercises/warmups.mp4", "Warmup")
wm_timer = Timer("Warmup", 45)
wm_alert = Alert("info", "Roll your shoulders · March in place · Loosen your hips")
wm_cue = Cue("Warmup time. Move gently — we're just waking your joints up.")
wm_followups = FollowUps(["Skip warmup", "I'm already warmed up"])
s_r1_intro = Screen([r1i_title, r1i_kw_ex, r1i_kw_time, r1i_desc, r1i_cue, r1i_followups])
r1i_title = Text("Round 1 of 2", "title")
r1i_kw_ex = Keyword("3", "exercises")
r1i_kw_time = Keyword("40s", "each")
r1i_desc = Text("Squats · Push-Ups · High Knees. Circuit style, back to back.", "body")
r1i_cue = Cue("Round 1. Three exercises, 40 seconds each. Start each timer when you're set.")
r1i_followups = FollowUps(["Start Round 1", "What are the exercises?"])
s_r1_squats = Screen([sq1_title, sq1_kw, sq1_video, sq1_timer, sq1_alert, sq1_cue, sq1_followups])
sq1_title = Text("Squats", "title")
sq1_kw = Keyword("40s", "Exercise 1 of 3")
sq1_video = Video("/exercises/squats.mp4", "Squats")
sq1_timer = Timer("Squats · Round 1", 40)
sq1_alert = Alert("info", "Feet shoulder-width apart. Push hips back and lower with control.")
sq1_cue = Cue("Feet shoulder-width apart. Let's move with control. Start the timer when ready.")
sq1_followups = FollowUps(["Next exercise", "How do I do a squat?"])
s_r1_pushups = Screen([pu1_title, pu1_kw, pu1_video, pu1_timer, pu1_alert, pu1_cue, pu1_followups])
pu1_title = Text("Push-Ups", "title")
pu1_kw = Keyword("40s", "Exercise 2 of 3")
pu1_video = Video("/exercises/pushup.mp4", "Push-Ups")
pu1_timer = Timer("Push-Ups · Round 1", 40)
pu1_alert = Alert("info", "Hands just wider than shoulders. Core aligned from head to heels.")
pu1_cue = Cue("Set your hands just wider than your shoulders. Keep your body in a straight line.")
pu1_followups = FollowUps(["Next exercise", "I need a modification"])
s_r1_highknees = Screen([hk1_title, hk1_kw, hk1_video, hk1_timer, hk1_alert, hk1_cue, hk1_followups])
hk1_title = Text("High Knees", "title")
hk1_kw = Keyword("40s", "Exercise 3 of 3")
hk1_video = Video("/exercises/high-knees.mp4", "High Knees")
hk1_timer = Timer("High Knees · Round 1", 40)
hk1_alert = Alert("info", "Drive your knees to hip height. Pump your arms. Light on your feet.")
hk1_cue = Cue("Stand tall and alternate your knees. Keep your rhythm steady — rest is coming.")
hk1_followups = FollowUps(["Round 1 done!", "I need a break"])
s_rest = Screen([rest_title, rest_kw, rest_timer, rest_desc, rest_cue, rest_followups])
rest_title = Text("Rest", "title")
rest_kw = Keyword("60s", "Recovery")
rest_timer = Timer("Rest", 60)
rest_desc = Text("Round 2 is next. Same exercises, same timer.", "body")
rest_cue = Cue("Take a breath. Shake out your hands. Round two is coming up.")
rest_followups = FollowUps(["Skip rest — I'm ready", "Need more time"])
s_r2_intro = Screen([r2i_title, r2i_kw, r2i_alert, r2i_cue, r2i_followups])
r2i_title = Text("Round 2 of 2", "title")
r2i_kw = Keyword("Final round", "same exercises · same time")
r2i_alert = Alert("info", "You did this in Round 1. Go a little deeper this time.")
r2i_cue = Cue("Final round. Same three exercises. This is where it counts.")
r2i_followups = FollowUps(["Start Round 2", "How am I doing?"])
s_r2_squats = Screen([sq2_title, sq2_kw, sq2_video, sq2_timer, sq2_alert, sq2_cue, sq2_followups])
sq2_title = Text("Squats", "title")
sq2_kw = Keyword("40s", "Exercise 1 of 3 · Final round")
sq2_video = Video("/exercises/squats.mp4", "Squats")
sq2_timer = Timer("Squats · Round 2", 40)
sq2_alert = Alert("info", "Keep your chest lifted and push your hips back. Controlled descent.")
sq2_cue = Cue("Squats, Round 2. Keep your chest lifted and push hips back. Move with control.")
sq2_followups = FollowUps(["Next exercise", "How do I do a squat?"])
s_r2_pushups = Screen([pu2_title, pu2_kw, pu2_video, pu2_timer, pu2_alert, pu2_cue, pu2_followups])
pu2_title = Text("Push-Ups", "title")
pu2_kw = Keyword("40s", "Exercise 2 of 3 · Final round")
pu2_video = Video("/exercises/pushup.mp4", "Push-Ups")
pu2_timer = Timer("Push-Ups · Round 2", 40)
pu2_alert = Alert("info", "Full range of motion. Keep body aligned from head to heels.")
pu2_cue = Cue("Push-Ups, Round 2. Keep your body aligned from head to heels. Finish strong.")
pu2_followups = FollowUps(["Next exercise", "I need a modification"])
s_r2_highknees = Screen([hk2_title, hk2_kw, hk2_video, hk2_timer, hk2_alert, hk2_cue, hk2_followups])
hk2_title = Text("High Knees", "title")
hk2_kw = Keyword("40s", "Exercise 3 of 3 · FINAL")
hk2_video = Video("/exercises/high-knees.mp4", "High Knees")
hk2_timer = Timer("High Knees · Round 2", 40)
hk2_alert = Alert("warning", "Last one. Leave everything on the floor.")
hk2_cue = Cue("Stay in control. You're nearly there. Pump your arms and give it everything.")
hk2_followups = FollowUps(["I'm done!", "Finish workout"])
s_done = Screen([done_title, done_kw_rounds, done_kw_ex, done_list, done_cue, done_followups])
done_title = Text("Workout Complete", "title")
done_kw_rounds = Keyword("2 / 2", "Rounds")
done_kw_ex = Keyword("6", "exercises completed")
done_list = List([done_li1, done_li2, done_li3])
done_li1 = ListItem("Squats · 2 rounds", "numbered")
done_li2 = ListItem("Push-Ups · 2 rounds", "numbered")
done_li3 = ListItem("High Knees · 2 rounds", "numbered")
done_cue = Cue("You showed up and finished. That's what counts. Stretch your quads and chest.")
done_followups = FollowUps(["Start over", "Tell me how I did", "What should I do next time?"])`;

function fence(code: string): string {
  return '```openui\n' + code + '\n```';
}

function rootCursor(target: string): string {
  return `root = Screens([${WORKOUT_SCREENS.join(', ')}], ${target})`;
}

export function mockTurn(request: RequestData, fixture: string): Turn {
  const last = request.messages.at(-1)?.content.trim().toLowerCase() ?? '';

  // 12. Preserve existing demos
  if (last === 'load wiring sample' || last === '/demo') {
    return {
      reply:
        'Wiring fixture loaded. This is deterministic, not a model interpreting your skill.\n' +
        fence('root = Screens([])') +
        '\n' +
        fence(fixture),
    };
  }

  const doc = new ScreenDocument();
  if (request.state.ui_state) {
    doc.apply(fence(request.state.ui_state));
  }

  const isWorkout = doc.screens.length === 12 && doc.screens[0]?.key === 's_welcome';

  // If not yet in the ENERGIZE workout document
  if (!isWorkout) {
    // 1. Initial Workout trigger
    if (['let\'s go!', 'let\'s go', 'start', 'begin'].includes(last)) {
      return {
        reply:
          "Welcome to ENERGIZE. I'll guide you through every step. Tap Let's go when you're ready.\n" +
          fence(ENERGIZE_DOC),
      };
    }

    // Preserve existing fixture behavior
    const screens = doc.screens;
    const index = screens.findIndex(s => s.key === doc.cursor);
    if (['next', 'back'].includes(last) && screens.length) {
      const target = screens[Math.max(0, Math.min(screens.length - 1, index + (last === 'back' ? -1 : 1)))];
      return {
        reply: 'Fixture cursor moved.\n' + fence(`root = Screens([${screens.map(s => s.key).join(', ')}], ${target.key})`),
      };
    }
    if (/^change value to (\d{1,2})$/.test(last) && doc.program.includes('count1 =')) {
      const value = Number(last.match(/\d+/)![0]);
      return {
        reply:
          'Fixture values patched under their existing names.\n' +
          fence(
            serializeStatement('count1', 'Keyword', [String(value), 'Sample value']) +
              '\n' +
              serializeStatement('count2', 'Keyword', [String(value), 'Second sample value'])
          ),
      };
    }
    return {
      reply:
        'Mock only understands /demo, next, back and “change value to 6”. It does not read your skill. Edit the fixture/mock, test a local OpenUI patch in Builder tools, or explicitly enable a live provider.',
    };
  }

  // Inside the ENERGIZE workout flow
  const cursor = (doc.cursor || 's_welcome') as WorkoutScreen;
  const events = request.state.client_events ?? [];
  const timerFinished = events.some(e => /timer.*finished/i.test(e));

  // Safety boundaries: pain, dizziness, injury
  if (/pain|dizzy|dizziness|hurt|injury|faint|breathless/i.test(last)) {
    return {
      reply: 'Please stop exercising immediately and rest. If pain or dizziness persists, consult a healthcare professional. Your health and safety come first.',
    };
  }

  // Demonstration replay request
  if (last.includes('replay') || last.includes('demo') || last.includes('show video')) {
    return {
      reply: 'Replaying the movement demonstration. Move with control and focus on smooth reps.',
    };
  }

  // 2. WELCOME
  if (cursor === 's_welcome') {
    if (['let\'s go!', 'let\'s go', 'start', 'begin', 'got it — let\'s go!', 'got it - let\'s go!', 'ready, let\'s go!'].includes(last)) {
      return {
        reply:
          "Perfect. Let's start with a quick warmup — 45 seconds to wake your body up.\n" +
          fence(rootCursor('s_warmup')),
      };
    }
    if (last.includes('what is this workout')) {
      return {
        reply:
          'ENERGIZE is a 6-minute bodyweight circuit. Warmup, then 2 rounds of Squats, Push-Ups, and High Knees. 40 seconds per exercise. No equipment needed.\n' +
          fence('w_followups = FollowUps(["Got it — let\'s go!", "I\'m a beginner"])'),
      };
    }
    if (last.includes('beginner')) {
      return {
        reply:
          "You're in the right place. All exercises are bodyweight and adjustable. Go at your own pace — the timers are a guide, not a rule. Modify any movement as needed.\n" +
          fence('w_followups = FollowUps(["Ready, let\'s go!"])'),
      };
    }
    return {
      reply: "We're ready to begin whenever you are. Just say 'Let's go' or tap the button.",
    };
  }

  // 3. WARMUP
  if (cursor === 's_warmup') {
    if (['skip warmup', "i'm already warmed up", 'im already warmed up', 'next', 'start round 1'].includes(last)) {
      const prose = ['next', 'start round 1'].includes(last) ? 'Round 1 coming up.' : 'No problem. Going straight to Round 1.';
      return {
        reply: `${prose}\n` + fence(rootCursor('s_r1_intro')),
      };
    }
    if (timerFinished) {
      return {
        reply:
          "Warmup done. Say 'next' or tap below when you're ready for Round 1.\n" +
          fence('wm_followups = FollowUps(["Start Round 1"])'),
      };
    }
    if (last === 'back') {
      return { reply: 'Going back.\n' + fence(rootCursor('s_welcome')) };
    }
    return {
      reply: 'The warmup is 45 seconds — gentle movement to wake your body up. Start the timer when ready.',
    };
  }

  // 4. ROUND 1 INTRO
  if (cursor === 's_r1_intro') {
    if (['start round 1', 'start', 'next'].includes(last)) {
      return {
        reply: 'Here we go. First up: Squats.\n' + fence(rootCursor('s_r1_squats')),
      };
    }
    if (last.includes('exercise')) {
      return {
        reply: 'Squats, then Push-Ups, then High Knees. 40 seconds each. Back to back, circuit style.',
      };
    }
    if (last === 'back') {
      return { reply: 'Going back.\n' + fence(rootCursor('s_warmup')) };
    }
    return {
      reply: "Round 1 is 3 exercises, 40 seconds each. Tap 'Start Round 1' when you're set.",
    };
  }

  // 5. ROUND 1 SQUATS
  if (cursor === 's_r1_squats') {
    if (['next exercise', 'next'].includes(last)) {
      return {
        reply: 'On to Push-Ups.\n' + fence(rootCursor('s_r1_pushups')),
      };
    }
    if (last.includes('squat')) {
      return {
        reply:
          'Stand with feet hip-width apart. Lower your hips as if sitting into a chair. Keep your chest up and knees over toes. Drive through your heels to stand.\n' +
          fence('sq1_followups = FollowUps(["Got it — starting now"])'),
      };
    }
    if (timerFinished) {
      return {
        reply:
          "Squats done. Move straight to Push-Ups — say 'next exercise'.\n" +
          fence('sq1_followups = FollowUps(["Next exercise"])'),
      };
    }
    if (last === 'back') {
      return { reply: 'Going back.\n' + fence(rootCursor('s_r1_intro')) };
    }
    return {
      reply: "You're on Squats. 40 seconds. Start the timer and say 'next exercise' when done.",
    };
  }

  // 5. ROUND 1 PUSH-UPS
  if (cursor === 's_r1_pushups') {
    if (['next exercise', 'next'].includes(last)) {
      return {
        reply: 'Last exercise of Round 1: High Knees.\n' + fence(rootCursor('s_r1_highknees')),
      };
    }
    if (last.includes('modification') || last.includes('modify')) {
      return {
        reply:
          'Drop to your knees for knee push-ups — same movement, less load. Full credit either way.\n' +
          fence('pu1_followups = FollowUps(["Thanks, continuing now"])'),
      };
    }
    if (timerFinished) {
      return {
        reply:
          "Push-ups done. On to High Knees — the last one this round.\n" +
          fence('pu1_followups = FollowUps(["Next exercise"])'),
      };
    }
    if (last === 'back') {
      return { reply: 'Going back.\n' + fence(rootCursor('s_r1_squats')) };
    }
    return {
      reply: "You're on Push-Ups. Keep your core tight. Say 'next exercise' when done.",
    };
  }

  // 5. ROUND 1 HIGH KNEES
  if (cursor === 's_r1_highknees') {
    if (['round 1 done!', 'round 1 done', 'next', 'start rest'].includes(last)) {
      // Must go to s_rest, NOT s_done
      return {
        reply: 'Round 1 complete! Take 60 seconds — you earned it.\n' + fence(rootCursor('s_rest')),
      };
    }
    if (last.includes('break')) {
      return {
        reply:
          "Pause the timer and take what you need. Use the 'Pause preview' button in the toolbar to freeze everything. Resume when you're ready.",
      };
    }
    if (timerFinished) {
      return {
        reply:
          "High Knees done. Round 1 in the books — say 'next' to start your rest.\n" +
          fence('hk1_followups = FollowUps(["Start rest", "Round 1 done!"])'),
      };
    }
    if (last === 'back') {
      return { reply: 'Going back.\n' + fence(rootCursor('s_r1_pushups')) };
    }
    return {
      reply: 'Finish strong on High Knees! 40 seconds, then a 60-second rest.',
    };
  }

  // 6. REST
  if (cursor === 's_rest') {
    if (['skip rest — i\'m ready', 'skip rest - i\'m ready', 'skip rest', 'skip', 'next', 'start round 2', 'ready now'].includes(last)) {
      return {
        reply: "Let's go. Round 2 starting now.\n" + fence(rootCursor('s_r2_intro')),
      };
    }
    if (last.includes('more time') || last.includes('need more time')) {
      return {
        reply:
          "Take your time. You can pause the timer using the 'Pause preview' button. Say 'next' when you're set.\n" +
          fence('rest_followups = FollowUps(["Ready now"])'),
      };
    }
    if (timerFinished) {
      return {
        reply:
          "Rest over. Round 2 is ready when you are.\n" +
          fence('rest_followups = FollowUps(["Start Round 2"])'),
      };
    }
    if (last === 'back') {
      return { reply: 'Going back.\n' + fence(rootCursor('s_r1_highknees')) };
    }
    return {
      reply: 'Take this minute to catch your breath. Round 2 is coming up.',
    };
  }

  // 7. ROUND 2 INTRO
  if (cursor === 's_r2_intro') {
    if (['start round 2', 'start', 'next'].includes(last)) {
      return {
        reply: 'Round 2. First up: Squats.\n' + fence(rootCursor('s_r2_squats')),
      };
    }
    if (last.includes('doing') || last.includes('how am i doing')) {
      return {
        reply:
          "You completed the warmup and all of Round 1. That's already more than most people do today. One round left — finish strong.",
      };
    }
    if (last === 'back') {
      return { reply: 'Going back.\n' + fence(rootCursor('s_rest')) };
    }
    return {
      reply: "Final round. Same three exercises. Tap 'Start Round 2' when you're ready.",
    };
  }

  // 8. ROUND 2 SQUATS
  if (cursor === 's_r2_squats') {
    if (['next exercise', 'next'].includes(last)) {
      return {
        reply: 'Push-Ups. Keep that momentum.\n' + fence(rootCursor('s_r2_pushups')),
      };
    }
    if (last.includes('squat')) {
      return {
        reply: 'Go a little deeper than Round 1. Controlled descent. Keep chest up and drive through heels.',
      };
    }
    if (timerFinished) {
      return {
        reply:
          "Squats done. On to Push-Ups.\n" +
          fence('sq2_followups = FollowUps(["Next exercise"])'),
      };
    }
    if (last === 'back') {
      return { reply: 'Going back.\n' + fence(rootCursor('s_r2_intro')) };
    }
    return {
      reply: "You're on Round 2 Squats. Go deeper. Say 'next exercise' when done.",
    };
  }

  // 8. ROUND 2 PUSH-UPS
  if (cursor === 's_r2_pushups') {
    if (['next exercise', 'next'].includes(last)) {
      return {
        reply: 'Last exercise! High Knees — give it everything.\n' + fence(rootCursor('s_r2_highknees')),
      };
    }
    if (last.includes('modification') || last.includes('modify')) {
      return {
        reply: 'Drop to your knees for knee push-ups — keep your core tight and finish strong.',
      };
    }
    if (timerFinished) {
      return {
        reply:
          "Push-ups done. One more to go — High Knees to finish.\n" +
          fence('pu2_followups = FollowUps(["Next exercise"])'),
      };
    }
    if (last === 'back') {
      return { reply: 'Going back.\n' + fence(rootCursor('s_r2_squats')) };
    }
    return {
      reply: "Push-Ups, Round 2. Full range of motion. Say 'next exercise' when done.",
    };
  }

  // 8. ROUND 2 HIGH KNEES
  if (cursor === 's_r2_highknees') {
    if (['i\'m done!', 'im done!', 'im done', 'finish workout', 'see results', 'next'].includes(last)) {
      return {
        reply: "That's it! Workout complete. Outstanding effort.\n" + fence(rootCursor('s_done')),
      };
    }
    if (timerFinished) {
      // Must NOT automatically move to s_done
      return {
        reply:
          "High Knees done! You finished the entire circuit. Say 'next' or tap below to see your results.\n" +
          fence('hk2_followups = FollowUps(["See results", "I\'m done!"])'),
      };
    }
    if (last === 'back') {
      return { reply: 'Going back.\n' + fence(rootCursor('s_r2_pushups')) };
    }
    return {
      reply: 'This is the last exercise! Leave everything on the floor.',
    };
  }

  // 9. DONE
  if (cursor === 's_done') {
    if (last === 'start over') {
      // Clear OpenUI document and re-emit complete document at s_welcome
      return {
        reply:
          'Starting fresh. Ready when you are.\n' +
          fence('root = Screens([])') +
          '\n' +
          fence(ENERGIZE_DOC),
      };
    }
    if (last.includes('how i did') || last.includes('how did i do')) {
      return {
        reply:
          "You completed 2 full rounds — warmup, 6 exercises, and the rest interval. That's a solid 6-minute circuit. Great effort and consistency.",
      };
    }
    if (last.includes('next time')) {
      return {
        reply:
          'Next time, try to go a little deeper on squats and hold the bottom for a second. On High Knees, aim for thigh-parallel. Small progressions add up.',
      };
    }
    if (last === 'back') {
      return { reply: 'Going back.\n' + fence(rootCursor('s_r2_highknees')) };
    }
    return {
      reply: 'Workout complete! Well done. Stretch your quads and chest when you can.',
    };
  }

  // General navigation fallback for workout screens
  if (last === 'back') {
    const index = WORKOUT_SCREENS.indexOf(cursor);
    const target = WORKOUT_SCREENS[Math.max(0, index - 1)];
    return { reply: 'Going back.\n' + fence(rootCursor(target)) };
  }
  if (last === 'next') {
    const index = WORKOUT_SCREENS.indexOf(cursor);
    const target = WORKOUT_SCREENS[Math.min(WORKOUT_SCREENS.length - 1, index + 1)];
    return { reply: 'Next step.\n' + fence(rootCursor(target)) };
  }

  return { reply: "Keep moving! Say 'next' when you're ready for the next step." };
}
