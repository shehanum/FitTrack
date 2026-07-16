/* =========================================================================
   PROGRAM DATA
   This is the only file you should need to touch to change the workout
   content itself (exercises, sets/reps, phase structure, illustrations).
   To swap in new illustrations later: drop files into
   assets/illustrations/ using the same filename as the "img" field below
   (svg or png both work) — nothing else needs to change.
   ========================================================================= */

const EXERCISES = {
  sit_to_stand_squat: {
    name: "Sit-to-Stand Squat",
    img: "sit_to_stand_squat",
    howTo: "Sit on the front edge of a bench with feet flat. Stand up fully without using your hands, then lower back down under control until you touch the bench.",
    cue: "Use a bench for depth reference — bodyweight only."
  },
  band_pull_aparts: {
    name: "Band Pull-Aparts",
    img: "band_pull_aparts",
    howTo: "Hold a band with both hands at shoulder height, arms extended. Pull the band apart by driving your shoulder blades together, then return with control.",
    cue: null
  },
  standing_shoulder_press: {
    name: "Standing Dumbbell Shoulder Press",
    img: "standing_shoulder_press",
    howTo: "Hold a light dumbbell in each hand at shoulder height. Press straight overhead until arms are extended, then lower back to shoulder height.",
    cue: "Light load — this is a warm-up movement."
  },
  seated_shoulder_press: {
    name: "Seated Dumbbell Shoulder Press",
    img: "seated_shoulder_press",
    howTo: "Seated on a bench, hold dumbbells at shoulder height. Press straight overhead until arms are extended, then lower under control.",
    cue: "Seated on a bench for back support."
  },
  step_ups: {
    name: "Step-Ups",
    img: "step_ups",
    howTo: "Place one foot fully on a low step or bench. Drive through that foot to stand up on the step, then step back down with control. Keep the step low enough to avoid knee strain.",
    cue: null
  },
  seated_row: {
    name: "Seated Cable/Band Row",
    img: "seated_row",
    howTo: "Sit with legs extended, band or cable anchored at foot height. Pull the handle to your torso, squeezing your shoulder blades together, then extend back out with control.",
    cue: null
  },
  bird_dog: {
    name: "Bird-Dog",
    img: "bird_dog",
    howTo: "Start on hands and knees. Extend one arm and the opposite leg straight out until level with your torso, hold briefly, then return and switch sides.",
    cue: null
  },
  dead_bug: {
    name: "Dead Bug",
    img: "dead_bug",
    howTo: "Lie on your back with arms reaching up and knees bent at 90°. Slowly extend one arm overhead and the opposite leg out straight, without letting your lower back arch off the floor. Return and switch sides.",
    cue: null
  },
  plank: {
    name: "Plank",
    img: "plank",
    howTo: "Support your body on forearms/hands and toes, forming a straight line from head to heels. Brace your core and hold without letting your hips sag or pike up.",
    cue: null
  },
  side_plank: {
    name: "Side Plank",
    img: "side_plank",
    howTo: "Lie on your side, propped on one forearm, legs stacked. Lift your hips until your body forms a straight line, hold briefly, then lower with control.",
    cue: "Short holds are fine to start."
  },
  cat_cow: {
    name: "Cat-Cow",
    img: "cat_cow",
    howTo: "On hands and knees, alternate between arching your back and looking up (cow) and rounding your spine toward the ceiling while tucking your chin (cat), moving slowly with your breath.",
    cue: null
  },
  worlds_greatest_stretch: {
    name: "World's Greatest Stretch",
    img: "worlds_greatest_stretch",
    howTo: "From a deep lunge, plant the opposite hand on the ground and rotate your torso, reaching your other arm toward the ceiling. Follow your hand with your eyes, then return and switch sides.",
    cue: null
  },
  ninety_ninety_switch: {
    name: "90/90 Hip Switch",
    img: "ninety_ninety_switch",
    howTo: "Sit with both knees bent at 90°, one in front and one behind you. Rotate through your hips to switch which leg is in front, keeping your torso upright.",
    cue: null
  },
  standing_quad_stretch: {
    name: "Standing Quad Stretch",
    img: "standing_quad_stretch",
    howTo: "Standing on one leg, grab the opposite ankle behind you and gently pull your heel toward your glute, keeping your knees close together. Hold, then switch sides.",
    cue: "Hold onto something for balance if needed."
  },
  doorway_chest_stretch: {
    name: "Doorway Chest/Shoulder Stretch",
    img: "doorway_chest_stretch",
    howTo: "Place your forearm on a doorframe with your elbow bent at 90°. Gently lean your body forward through the doorway until you feel a stretch across your chest and shoulder. Hold, then switch sides.",
    cue: null
  },
  thread_the_needle: {
    name: "Thread the Needle",
    img: "thread_the_needle",
    howTo: "From hands and knees, slide one arm underneath your body and through the gap, rotating your torso until your shoulder and head rest on the floor. Hold, then return and switch sides.",
    cue: null
  },
  goblet_squat: {
    name: "Goblet Squat",
    img: "goblet_squat",
    howTo: "Hold a dumbbell or kettlebell vertically against your chest. Squat down by bending your hips and knees together, keeping your chest up, until thighs are roughly parallel to the floor, then stand back up.",
    cue: null
  },
  romanian_deadlift: {
    name: "Romanian Deadlift",
    img: "romanian_deadlift",
    howTo: "Hold dumbbells in front of your thighs. Keeping a slight bend in your knees and your back flat, hinge forward at the hips, lowering the weights along your legs until you feel a hamstring stretch, then drive your hips forward to stand.",
    cue: null
  },
  walking_lunges: {
    name: "Walking Lunges",
    img: "walking_lunges",
    howTo: "Holding a dumbbell in each hand, step forward into a lunge until both knees are bent near 90°, then push off the front foot to bring your back leg through into the next step.",
    cue: null
  },
  glute_bridge: {
    name: "Weighted Glute Bridge",
    img: "glute_bridge",
    howTo: "Lie on your back with knees bent, feet flat, a weight resting across your hips. Drive through your heels to lift your hips until your body forms a straight line from shoulders to knees, then lower with control.",
    cue: null
  },
  calf_raise: {
    name: "Standing Calf Raise",
    img: "calf_raise",
    howTo: "Standing tall, rise up onto the balls of your feet as high as you can, pause briefly, then lower your heels back down under control.",
    cue: null
  },
  flat_bench_press: {
    name: "Flat Dumbbell Bench Press",
    img: "flat_bench_press",
    howTo: "Lying on a bench, hold dumbbells above your chest with arms extended. Lower them under control until elbows are roughly level with the bench, then press back up.",
    cue: null
  },
  incline_dumbbell_press: {
    name: "Incline Dumbbell Press",
    img: "incline_dumbbell_press",
    howTo: "On an incline bench, hold dumbbells above your upper chest with arms extended. Lower them under control, then press back up.",
    cue: null
  },
  lat_pulldown: {
    name: "Cable Lat Pulldown",
    img: "lat_pulldown",
    howTo: "Seated with thighs braced under the pad, grip the bar wider than shoulder width. Pull the bar down to your upper chest, squeezing your shoulder blades down and together, then let it rise back up with control.",
    cue: null
  },
  bicep_curl: {
    name: "Dumbbell Bicep Curl",
    img: "bicep_curl",
    howTo: "Standing with a dumbbell in each hand and elbows pinned to your sides, curl the weights up toward your shoulders without swinging, then lower back down with control.",
    cue: null
  },
  tricep_pressdown: {
    name: "Cable Tricep Pressdown",
    img: "tricep_pressdown",
    howTo: "Standing at a cable stack with elbows pinned to your sides, push the bar or rope down until your arms are fully extended, then let it rise back up with control.",
    cue: null
  },
  chest_fly: {
    name: "Cable Chest Fly",
    img: "chest_fly",
    howTo: "Lying on a bench, hold dumbbells above your chest with a slight bend in your elbows. Lower them out to the sides in a wide arc until you feel a stretch across your chest, then bring them back together.",
    cue: null
  },
  lateral_raise: {
    name: "Lateral Raise",
    img: "lateral_raise",
    howTo: "Standing with a dumbbell in each hand at your sides, raise both arms out to shoulder height with a slight elbow bend, then lower back down with control.",
    cue: null
  },
  single_arm_row: {
    name: "Single-Arm Dumbbell Row",
    img: "single_arm_row",
    howTo: "With one knee and hand supported on a bench, hold a dumbbell in the other hand hanging straight down. Pull it up to your ribcage, squeezing your shoulder blade back, then lower with control.",
    cue: null
  },
  face_pulls: {
    name: "Face Pulls",
    img: "face_pulls",
    howTo: "With a band or cable anchored at head height, pull the handles toward your face, leading with your elbows and rotating your hands outward, then return with control.",
    cue: null
  },
  bulgarian_split_squat: {
    name: "Bulgarian Split Squat",
    img: "bulgarian_split_squat",
    howTo: "With the top of one foot resting on a bench behind you, lower your back knee toward the floor by bending your front leg, then push through your front foot to stand.",
    cue: "Bench-assisted — hold dumbbells once comfortable."
  },
  farmers_carry: {
    name: "Farmer's Carry",
    img: "farmers_carry",
    howTo: "Holding a heavy dumbbell or kettlebell in each hand, walk forward with your shoulders back and core braced, taking controlled steps for the prescribed time or distance.",
    cue: null
  },
  cardio_machine: {
    name: "Cardio (Elliptical / Bike)",
    img: "cardio_machine",
    howTo: "Set the machine to a steady, sustainable pace where you can hold a conversation in short sentences. Keep posture upright and shoulders relaxed.",
    cue: null
  }
};

// Helper to build an exercise entry with a per-day prescription/notes override.
function ex(id, prescription, notes) {
  const base = EXERCISES[id];
  return { id, prescription, notes: notes || null, ...base };
}

const PROGRAM = {
  phases: [
    {
      id: 1,
      title: "Foundation",
      weeks: "Weeks 1–4",
      objective: "Restore joint range of motion, re-activate stabilizer muscles, rebuild the habit, establish an aerobic base.",
      schedule: {
        1: { title: "Full-Body Mobility & Light Strength", duration: 40, exercises: [
          ex("sit_to_stand_squat", "2 x 10"),
          ex("band_pull_aparts", "2 x 15"),
          ex("standing_shoulder_press", "2 x 10", "Light load"),
          ex("step_ups", "2 x 8 / leg", "Low step height"),
          ex("seated_row", "2 x 12"),
          ex("bird_dog", "2 x 8 / side"),
          ex("dead_bug", "2 x 10 / side"),
          ex("plank", "2 x 20–30 sec")
        ]},
        2: { title: "Easy Cardio — Elliptical", duration: 25, exercises: [
          ex("cardio_machine", "25 min steady state")
        ]},
        3: { title: "Full-Body Strength", duration: 40, exercises: [
          ex("sit_to_stand_squat", "2 x 10"),
          ex("band_pull_aparts", "2 x 15"),
          ex("standing_shoulder_press", "2 x 10", "Light load"),
          ex("step_ups", "2 x 8 / leg", "Low step height"),
          ex("seated_row", "2 x 12"),
          ex("bird_dog", "2 x 8 / side"),
          ex("dead_bug", "2 x 10 / side"),
          ex("plank", "2 x 20–30 sec")
        ]},
        4: { title: "Mobility & Core Flow", duration: 30, exercises: [
          ex("cat_cow", "10 reps"),
          ex("worlds_greatest_stretch", "5 / side"),
          ex("ninety_ninety_switch", "8 / side"),
          ex("standing_quad_stretch", "30 sec / side"),
          ex("doorway_chest_stretch", "30 sec / side"),
          ex("thread_the_needle", "5 / side"),
          ex("side_plank", "2 short holds / side")
        ]},
        5: { title: "Easy Cardio — Spin Bike", duration: 25, exercises: [
          ex("cardio_machine", "25 min steady state")
        ]},
        6: { title: "Full-Body Strength", duration: 40, exercises: [
          ex("sit_to_stand_squat", "2 x 10"),
          ex("band_pull_aparts", "2 x 15"),
          ex("standing_shoulder_press", "2 x 10", "Light load"),
          ex("step_ups", "2 x 8 / leg", "Low step height"),
          ex("seated_row", "2 x 12"),
          ex("bird_dog", "2 x 8 / side"),
          ex("dead_bug", "2 x 10 / side"),
          ex("plank", "2 x 20–30 sec")
        ]},
        0: null
      }
    },
    {
      id: 2,
      title: "Strength Base",
      weeks: "Weeks 5–8",
      objective: "Increase load and volume, split training by body region, introduce cardio intervals.",
      schedule: {
        1: { title: "Lower Body Strength", duration: 45, exercises: [
          ex("goblet_squat", "3 x 10"),
          ex("romanian_deadlift", "3 x 10"),
          ex("walking_lunges", "2 x 10 / leg"),
          ex("glute_bridge", "3 x 12"),
          ex("calf_raise", "3 x 15"),
          ex("plank", "3 x 30–40 sec")
        ]},
        2: { title: "Cardio Intervals — Bike", duration: 30, exercises: [
          ex("cardio_machine", "5 min warm-up, 6–8 x (1 min hard / 2 min easy), 5 min cool-down")
        ]},
        3: { title: "Upper Body Strength", duration: 45, exercises: [
          ex("flat_bench_press", "3 x 10"),
          ex("lat_pulldown", "3 x 10", "Or band pulldown"),
          ex("seated_shoulder_press", "3 x 10"),
          ex("seated_row", "3 x 12"),
          ex("bicep_curl", "2 x 12"),
          ex("tricep_pressdown", "2 x 12")
        ]},
        4: { title: "Mobility/Core + Easy Cardio", duration: 30, exercises: [
          ex("cat_cow", "10 reps"),
          ex("worlds_greatest_stretch", "5 / side"),
          ex("side_plank", "2 short holds / side"),
          ex("cardio_machine", "15 min easy")
        ]},
        5: { title: "Lower Body Strength", duration: 45, exercises: [
          ex("goblet_squat", "3 x 10"),
          ex("romanian_deadlift", "3 x 10"),
          ex("walking_lunges", "2 x 10 / leg"),
          ex("glute_bridge", "3 x 12"),
          ex("calf_raise", "3 x 15"),
          ex("plank", "3 x 30–40 sec")
        ]},
        6: { title: "Upper Body Strength", duration: 45, exercises: [
          ex("flat_bench_press", "3 x 10"),
          ex("lat_pulldown", "3 x 10", "Or band pulldown"),
          ex("seated_shoulder_press", "3 x 10"),
          ex("seated_row", "3 x 12"),
          ex("bicep_curl", "2 x 12"),
          ex("tricep_pressdown", "2 x 12")
        ]},
        0: null
      }
    },
    {
      id: 3,
      title: "Overload & Run Base",
      weeks: "Weeks 9–12",
      objective: "Push/Pull/Legs rotation with heavier loads, structured run-walk intervals toward a 5K.",
      schedule: {
        1: { title: "Push Day", duration: 50, exercises: [
          ex("incline_dumbbell_press", "4 x 8–10"),
          ex("seated_shoulder_press", "3 x 10"),
          ex("chest_fly", "3 x 12"),
          ex("lateral_raise", "3 x 12"),
          ex("tricep_pressdown", "3 x 12")
        ]},
        2: { title: "Run-Walk Intervals", duration: 30, exercises: [
          ex("cardio_machine", "See run-walk progression for this week")
        ]},
        3: { title: "Pull Day", duration: 50, exercises: [
          ex("lat_pulldown", "4 x 8–10"),
          ex("single_arm_row", "3 x 10 / side"),
          ex("seated_row", "3 x 12"),
          ex("face_pulls", "3 x 15"),
          ex("bicep_curl", "3 x 12")
        ]},
        4: { title: "Leg Day", duration: 50, exercises: [
          ex("goblet_squat", "4 x 8–10"),
          ex("romanian_deadlift", "3 x 10"),
          ex("bulgarian_split_squat", "3 x 8 / leg"),
          ex("glute_bridge", "3 x 12"),
          ex("calf_raise", "3 x 15"),
          ex("farmers_carry", "3 x 30–40 sec")
        ]},
        5: { title: "Run-Walk or Elliptical Intervals", duration: 30, exercises: [
          ex("cardio_machine", "See run-walk progression for this week")
        ]},
        6: { title: "Full-Body / Weak-Point Strength", duration: 45, exercises: [
          ex("goblet_squat", "3 x 10"),
          ex("flat_bench_press", "3 x 10"),
          ex("seated_row", "3 x 12"),
          ex("lateral_raise", "2 x 12"),
          ex("plank", "3 x 40 sec")
        ]},
        0: null
      }
    }
  ]
};

// Weekday labels, Monday-first to match the program's Mon–Sun layout.
// Internally keyed 0=Sunday..6=Saturday to match JS Date.getDay(), remapped in app.js.
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
