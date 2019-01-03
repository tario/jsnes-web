import { Controller } from "jsnes";

// Mapping buttons code to [controller, button]
const BUTTON_ACTIONS = {
  0: [1, Controller.BUTTON_A],
  2: [1, Controller.BUTTON_B],
  8: [1, Controller.BUTTON_SELECT],
  9: [1, Controller.BUTTON_START],
  12: [1, Controller.BUTTON_UP],
  13: [1, Controller.BUTTON_DOWN],
  14: [1, Controller.BUTTON_LEFT],
  15: [1, Controller.BUTTON_RIGHT]
};

export default class GamepadController {
  constructor(options) {
    this.onButtonDown = options.onButtonDown;
    this.onButtonUp = options.onButtonUp;
    this.gamepadsIndexes = [];
    this.gamepadState = [];
  }

  poll = () => {
    const gamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : navigator.webkitGetGamepads();

    for (let i = 0; i < this.gamepadsIndexes.length; i++) {
      const gamepadIndex = this.gamepadsIndexes[i];
      const gamepad = gamepads[gamepadIndex];
      const previousGamepad = this.gamepadState[gamepadIndex];

      if (!previousGamepad) {
        this.gamepadState[gamepadIndex] = gamepad;
        continue;
      }

      const buttons = gamepad.buttons;
      const previousButtons = previousGamepad.buttons;

      for (let code in BUTTON_ACTIONS) {
        const button = buttons[code];
        const previousButton = previousButtons[code];

        const action = BUTTON_ACTIONS[code];
        if (button.pressed && !previousButton.pressed) {
          this.onButtonDown(action[0], action[1]);
        } else if (!button.pressed && previousButton.pressed) {
          this.onButtonUp(action[0], action[1]);
        }
      }

      this.gamepadState[gamepadIndex] = {
        buttons: buttons.map(b => {
          return { pressed: b.pressed };
        })
      };
    }
  };

  handleGamepadConnected = e => {
    this.gamepadsIndexes.push(e.gamepad.index);
    e.preventDefault();
  };

  handleGamepadDisconnected = e => {
    this.gamepadsIndexes = this.gamepads.filter(g => g !== e.gamepad.index);
    e.preventDefault();
  };

  startPolling = () => {
    let stopped = false;
    const loop = () => {
      if (stopped) return;

      this.poll();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    return {
      stop: () => {
        stopped = true;
      }
    };
  };
}
