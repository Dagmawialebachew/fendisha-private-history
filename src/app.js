import {
  React,
  ReactDOM,
  html,
} from './lib/react.js';


import {
  DarionAI,
} from './components/DarionAI.js';



import {
  config,
} from './config.js';

import {
  TrackingBridge,
} from './components/TrackingBridge.js';


import {
  PreBirthdayGate,
} from './components/PreBirthdayGate.js';


import {
  storage,
} from './lib/storage.js';

import {
  HEART_TOTAL,
  getHeartSecret,
} from './heartSecrets.js';


import {
  HeartTracker,
} from './components/HeartTracker.js';

import {
  OurSoundtrack,
} from './components/OurSoundtrack.js';

import {
  HeartReveal,
} from './components/HeartReveal.js';

import {
  SecretCrushReveal,
} from './components/SecretCrushReveal.js';

import {
  Toast,
} from './components/Toast.js';

import {
  OldSoulToggle,
} from './components/OldSoulToggle.js';

import {
  SceneGate,
} from './components/SceneGate.js';


import {
  EntryGatePage,
} from './pages/01_EntryGatePage.js';

import {
  BirthdayRoomPage,
} from './pages/02_BirthdayRoomPage.js';

import {
  MoodChoicePage,
} from './pages/03_MoodChoicePage.js';

import {
  BirthdayHeroPage,
} from './pages/04_BirthdayHeroPage.js';

import {
  ThingsINoticePage,
} from './pages/05_ThingsINoticePage.js';

import {
  OurMomentsPage,
} from './pages/06_OurMomentsPage.js';

import {
  CallsPage,
} from './pages/07_CallsPage.js';

import {
  PlacesPage,
} from './pages/08_PlacesPage.js';

import {
  Feb13Page,
} from './pages/09_Feb13Page.js';

import {
  DistancePage,
} from './pages/10_DistancePage.js';

import {
  FaithPage,
} from './pages/11_FaithPage.js';

import {
  PastLivesPage,
} from './pages/12_PastLivesPage.js';

import {
  FuturePage,
} from './pages/13_FuturePage.js';

import {
  HerGiftPage,
} from './pages/14_HerGiftPage.js';

import {
  FinalePage,
} from './pages/15_FinalePage.js';

import {
  AfterwordPage,
} from './pages/16_AfterwordPage.js';

import {
  ArtifactPage,
} from './pages/17_ArtifactPage.js';



const EXPERIENCE_SCENES = [
  {
    id: 'birthday-room',
    component:
      BirthdayRoomPage,
    backLabel: null,
  },

  {
    id: 'mood-choice',
    component:
      MoodChoicePage,
    backLabel:
      'back to the room',
  },

  {
    id: 'you-at-21',
    component:
      BirthdayHeroPage,
    backLabel:
      'back to your mood',
  },

  {
    id: 'things-i-notice',
    component:
      ThingsINoticePage,
    backLabel:
      'back to your birthday',
  },

  {
    id: 'our-moments',
    component:
      OurMomentsPage,
    backLabel:
      'back to what I notice',
  },

  {
    id: 'calls',
    component:
      CallsPage,
    backLabel:
      'back to our moments',
  },

  {
    id: 'places',
    component:
      PlacesPage,
    backLabel:
      'back to the calls',
  },

  {
    id: 'feb-13',
    component:
      Feb13Page,
    backLabel:
      'back to our places',
  },

  {
    id: 'distance',
    component:
      DistancePage,
    backLabel:
      'back to the private drawer',
  },

  {
    id: 'faith',
    component:
      FaithPage,
    backLabel:
      'back to the quiet part',
  },

  {
    id: 'past-lives',
    component:
      PastLivesPage,
    backLabel:
      'back to faith',
  },

  {
    id: 'future',
    component:
      FuturePage,
    backLabel:
      'back to old souls',
  },

  {
    id: 'her-gift',
    component:
      HerGiftPage,
    backLabel:
      'back to what comes next',
  },

  {
    id: 'finale',
    component:
      FinalePage,
    backLabel:
      'back to your gift',
  },

  {
    id: 'afterword',
    component:
      AfterwordPage,
    backLabel:
      'back to the finale',
  },

  {
    id: 'artifact',
    component:
      ArtifactPage,
    backLabel:
      'back one more time',
  },
];



const SCENE_STORAGE_KEY =
  'fendisha-current-scene';



function readSavedScene() {
  try {
    const raw =
      localStorage.getItem(
        SCENE_STORAGE_KEY
      );


    if (
      raw === null ||
      raw === ''
    ) {
      return 0;
    }


    const index =
      Number(raw);


    if (
      Number.isInteger(
        index
      ) &&
      index >= 0 &&
      index <
        EXPERIENCE_SCENES.length
    ) {
      return index;
    }
  } catch (error) {
    // persistence optional
  }


  return 0;
}



function saveScene(
  index
) {
  try {
    localStorage.setItem(
      SCENE_STORAGE_KEY,
      String(index)
    );
  } catch (error) {
    // persistence optional
  }
}



class ExperienceApp extends React.Component {
  constructor(props) {
    super(props);


    const params =
      new URLSearchParams(
        location.search
      );


    if (
      params.has(
        'reset'
      )
    ) {
      localStorage.removeItem(
        'fendisha-unlocked'
      );

      localStorage.removeItem(
        'fendisha-mood'
      );

      localStorage.removeItem(
        'fendisha-old-soul'
      );

      localStorage.removeItem(
        'fendisha-hearts'
      );

      localStorage.removeItem(
        'fendisha-room-walkthrough'
      );

      localStorage.removeItem(
        SCENE_STORAGE_KEY
      );
    }


    this.alreadyUnlocked =
      storage.isUnlocked() &&
      !config.preview;


    this.state = {
      unlocked: false,

      sceneIndex:
        readSavedScene(),

      found:
        storage.getFoundHearts(),

      mood:
        storage.getMood(),

      oldSoul:
        storage.getOldSoul(),

      toast: '',

      transitioning:
        false,

      transitionDirection:
        'forward',

      /*
      |--------------------------------------------------------------------------
      | HEART ENGINE
      |--------------------------------------------------------------------------
      */

      activeHeartId:
        null,
        secretCrushOpen:
  false,
    };


    this.toastTimer =
      null;

    this.sceneTimer =
      null;
  }



  componentDidMount() {
    console.log(
      '%cYou really opened DevTools on your birthday gift? 😂💜\n\nHello, My Fendisha 🍿\n\nDarion loves you. Now close this before you accidentally find things you were supposed to discover properly.',
      'color:#7c43ac;background:#fff5fc;padding:14px;font:14px/1.65 monospace;border:1px solid #e9ccf7;border-radius:10px'
    );
  }



  componentWillUnmount() {
    clearTimeout(
      this.toastTimer
    );

    clearTimeout(
      this.sceneTimer
    );
  }



  /*
  |--------------------------------------------------------------------------
  | ENTRY
  |--------------------------------------------------------------------------
  */

  unlock = () => {
    storage.setUnlocked();

    this.setState({
      unlocked: true,
    });
  };



  /*
  |--------------------------------------------------------------------------
  | NAVIGATION
  |--------------------------------------------------------------------------
  */

  goNext = (
    _legacyTargetId
  ) => {
    if (
      this.state
        .transitioning
    ) {
      return;
    }


    const currentIndex =
      this.state.sceneIndex;


    const nextIndex =
      Math.min(
        currentIndex + 1,

        EXPERIENCE_SCENES.length -
          1
      );


    if (
      nextIndex ===
      currentIndex
    ) {
      return;
    }


    this.navigateToScene(
      nextIndex,
      'forward'
    );
  };



  goPrevious = () => {
    if (
      this.state
        .transitioning ||
      this.state
        .sceneIndex <= 0
    ) {
      return;
    }


    this.navigateToScene(
      this.state
        .sceneIndex - 1,

      'back'
    );
  };



  navigateToScene = (
    nextIndex,
    direction = 'forward'
  ) => {
    if (
      this.state
        .transitioning
    ) {
      return;
    }


    const safeIndex =
      Math.max(
        0,

        Math.min(
          EXPERIENCE_SCENES.length -
            1,

          nextIndex
        )
      );


    if (
      safeIndex ===
      this.state.sceneIndex
    ) {
      return;
    }


    clearTimeout(
      this.sceneTimer
    );


    this.setState(
      {
        transitioning: true,

        transitionDirection:
          direction,

        /*
        | Never carry a heart modal
        | into another scene.
        */

        activeHeartId:
          null,
      },

      () => {
        this.sceneTimer =
          setTimeout(
            () => {
              saveScene(
                safeIndex
              );


              this.setState({
                sceneIndex:
                  safeIndex,

                transitioning:
                  false,

                transitionDirection:
                  direction,
              });
            },

            190
          );
      }
    );
  };



  goToScene = (
    index
  ) => {
    const safeIndex =
      Math.max(
        0,

        Math.min(
          EXPERIENCE_SCENES.length -
            1,

          Number(index) || 0
        )
      );


    saveScene(
      safeIndex
    );


    this.setState({
      sceneIndex:
        safeIndex,

      transitioning:
        false,

      transitionDirection:
        'forward',

      activeHeartId:
        null,
    });
  };



  /*
  |--------------------------------------------------------------------------
  | MOOD
  |--------------------------------------------------------------------------
  */

  setMood = (
    mood
  ) => {
    storage.setMood(
      mood
    );


    this.setState({
      mood,
    });
  };



  /*
  |--------------------------------------------------------------------------
  | OLD SOUL
  |--------------------------------------------------------------------------
  */

  setOldSoul = (
    oldSoul
  ) => {
    storage.setOldSoul(
      oldSoul
    );


    this.setState({
      oldSoul,
    });


    this.showToast(
      oldSoul
        ? 'Old soul mode. A little softer, a little older, still us. ✉️'
        : 'Back to 2026 😂💜'
    );
  };



  /*
  |--------------------------------------------------------------------------
  | NORMAL TOAST
  |--------------------------------------------------------------------------
  */

  showToast = (
    message,
    ms = 4800
  ) => {
    clearTimeout(
      this.toastTimer
    );


    this.setState({
      toast:
        message,
    });


    this.toastTimer =
      setTimeout(
        () =>
          this.setState({
            toast: '',
          }),

        ms
      );
  };



  /*
  |--------------------------------------------------------------------------
  | HEART ENGINE V2
  |--------------------------------------------------------------------------
  */

  findHeart = (
    id
  ) => {
    const numericId =
      Number(id);


    if (
      !numericId ||
      numericId < 1 ||
      numericId >
        HEART_TOTAL
    ) {
      return;
    }


    const secret =
      getHeartSecret(
        numericId
      );


    if (
      !secret
    ) {
      return;
    }


    const found =
      new Set(
        this.state.found
      );


    const fresh =
      !found.has(
        numericId
      );


    /*
    |--------------------------------------------------------------------------
    | ALREADY FOUND?
    |--------------------------------------------------------------------------
    |
    | Still open it.
    | Never increment twice.
    |
    */

    if (
      fresh
    ) {
      found.add(
        numericId
      );


      storage.setFoundHearts(
        found
      );
    }


    this.setState(
      {
        found,

        activeHeartId:
          numericId,
      },

      () => {
        /*
        | Tiny tactile confirmation.
        */

        if (
          navigator.vibrate
        ) {
          navigator.vibrate(
            numericId ===
              19
              ? [
                  12,
                  30,
                  18,
                  45,
                  24,
                ]

              : numericId ===
                  21
                ? [
                    15,
                    25,
                    15,
                    25,
                    35,
                  ]

                : fresh
                  ? [
                      10,
                      24,
                      14,
                    ]

                  : 8
          );
        }
      }
    );
  };



  closeHeartReveal =
    () => {
      this.setState({
        activeHeartId:
          null,
      });
    };

    openSecretCrushReveal =
  () => {
    this.setState({
      activeHeartId:
        null,

      secretCrushOpen:
        true,
    });
  };


closeSecretCrushReveal =
  () => {
    this.setState({
      secretCrushOpen:
        false,
    });
  };



  /*
  |--------------------------------------------------------------------------
  | EXPERIENCE
  |--------------------------------------------------------------------------
  */

  renderExperience() {
    const scene =
      EXPERIENCE_SCENES[
        this.state.sceneIndex
      ];


    if (!scene) {
      return null;
    }


    const CurrentPage =
      scene.component;


    const common = {
      found:
        this.state.found,

      onFindHeart:
        this.findHeart,

      onContinue:
        this.goNext,
    };


    const heartSystemStarted =
      this.state.found.has(
        1
      );


    const activeSecret =
      this.state
        .activeHeartId
        ? getHeartSecret(
            this.state
              .activeHeartId
          )

        : null;


    return html`
      <div
        className=${
          this.state.oldSoul
            ? 'old-soul-mode'
            : ''
        }
      >

        <!--
        ================================================================
        HEART COUNTER

        Does NOT exist until she finds Heart 01.
        ================================================================
        -->

        <${HeartTracker}
          count=${
            this.state
              .found.size
          }

          started=${
            heartSystemStarted
          }
        />


        <${OldSoulToggle}
          active=${
            this.state.oldSoul
          }

          onToggle=${
            this.setOldSoul
          }
        />


          <${OurSoundtrack}
      visible=${this.state.sceneIndex >= 2}
    />


        


        <${SceneGate}
          key=${scene.id}

          sceneKey=${scene.id}

          direction=${
            this.state
              .transitionDirection
          }

          canGoBack=${
            this.state
              .sceneIndex > 0
          }

          onBack=${
            this.goPrevious
          }

          backLabel=${
            scene.backLabel ||
            'back'
          }
        >

          <${CurrentPage}
            ...${common}

            mood=${
              this.state.mood
            }

            onMood=${
              this.setMood
            }

            showToast=${
              this.showToast
            }
          />

        <//>


        <!--
        ================================================================
        HEART NOTE OVERLAY
        ================================================================
        -->

        <${HeartReveal}
  secret=${
    activeSecret
  }

  foundCount=${
    this.state
      .found.size
  }

  onClose=${
    this.closeHeartReveal
  }

  onOpenSecret=${
    this.openSecretCrushReveal
  }
/>

<${SecretCrushReveal}
  open=${
    this.state
      .secretCrushOpen
  }

  onClose=${
    this.closeSecretCrushReveal
  }

  proofImage="/media/secrets/is-he-single.jpg"
/>


        <!--
        ================================================================
        SCENE TRANSITION VEIL
        ================================================================
        -->

        <div
          className="
            pointer-events-none

            fixed

            inset-0

            z-[9999]

            bg-[#fffafd]

            transition-opacity

            duration-200
          "

          style=${{
            opacity:
              this.state
                .transitioning
                ? 0.58
                : 0,
          }}
        ></div>

      </div>
    `;
  }



  /*
  |--------------------------------------------------------------------------
  | ROOT
  |--------------------------------------------------------------------------
  */

  render() {
    return html`
      <div>

        ${
          this.state
            .unlocked
            ? this.renderExperience()

            : html`
                <${EntryGatePage}
                  alreadyUnlocked=${
                    this.alreadyUnlocked
                  }

                  onUnlock=${
                    this.unlock
                  }
                />
              `
        }


        <${Toast}
          message=${
            this.state.toast
          }
        />

      </div>

      ${
  !this.state.unlocked ||
  EXPERIENCE_SCENES[
    this.state.sceneIndex
  ]?.id !== 'birthday-room'
    ? html`
        <${DarionAI}
          sceneId=${
            this.state.unlocked
              ? EXPERIENCE_SCENES[
                  this.state.sceneIndex
                ]?.id || 'experience'
              : 'entry-gate'
          }
        />
      `
    : null
}

      <${TrackingBridge}
  unlocked=${this.state.unlocked}
  sceneIndex=${this.state.sceneIndex}
  sceneId=${
    EXPERIENCE_SCENES[
      this.state.sceneIndex
    ]?.id || ''
  }
  found=${this.state.found}
  mood=${this.state.mood}
  oldSoul=${this.state.oldSoul}
  secretCrushOpen=${
    this.state.secretCrushOpen
  }
/>
    `;
  }
}



ReactDOM.render(
  html`
    <${PreBirthdayGate}>
      <${ExperienceApp} />
    <//>
  `,
  document.getElementById('root')
);
