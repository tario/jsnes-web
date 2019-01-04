import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table
} from "reactstrap";
import { Controller } from "jsnes";
import ControlMapperRow from "./ControlMapperRow";

const GAMEPAD_ICON = "../img/nes_controller.png";
const KEYBOARD_ICON = "../img/keyboard.png";

class ControlsModal extends Component {
  constructor(props) {
    super(props);
    this.state = { gamepadConfig: props.gamepadConfig, keys: props.keys, button: undefined, modified: false };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.listenForKey = this.listenForKey.bind(this);

    this.state.gamepadConfig = this.state.gamepadConfig || {};
    this.state.gamepadConfig.playerGamepadId = this.state.gamepadConfig.playerGamepadId || [null, null];
    this.state.gamepadConfig.configs = this.state.gamepadConfig.configs || {};

    this.state.controllerIcon = this.state.gamepadConfig.playerGamepadId.map(gamepadId => gamepadId ? GAMEPAD_ICON : KEYBOARD_ICON);
    this.state.controllerIconAlt = this.state.gamepadConfig.playerGamepadId.map(gamepadId => gamepadId ? 'gamepad' : 'keyboard');
  }

  componentWillUnmount() {
    if (this.state.modified) {
      this.props.setKeys(this.state.keys);
      this.props.setGamepadConfig(this.state.gamepadConfig);
    }
    this.removeKeyListener("keydown", this.handleKeyDown);
  }

  listenForKey(button) {
    this.setState({ button });

    this.props.promptButton(buttonInfo => {
      const playerId = button[0];
      const buttonId = button[1];

      const gamepadId = buttonInfo.gamepadId;
      const gamepadConfig = this.state.gamepadConfig;

      // link player to gamepad
      const playerGamepadId = gamepadConfig.playerGamepadId.slice(0);
      const newConfig = {};

      playerGamepadId[playerId-1] = gamepadId;

      const rejectButtonId = b => {
        return b.buttonId !== buttonId;
      };

      const newButton = {code: buttonInfo.code, type: buttonInfo.type, buttonId: buttonId};
      newConfig[gamepadId] = {
        buttons: (gamepadConfig.configs[gamepadId] || {buttons: []}).buttons.filter(rejectButtonId).concat([newButton])
      };

      const configs = Object.assign({}, gamepadConfig.configs, newConfig);

      this.setState({
        gamepadConfig: {
          configs: configs,
          playerGamepadId: playerGamepadId
        },
        controllerIcon: playerGamepadId.map(gamepadId => gamepadId ? GAMEPAD_ICON : KEYBOARD_ICON),
        modified: true
      });
    });
    document.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(event) {
    var button = this.state.button;
    var keys = this.state.keys;
    var newKeys = {};
    for (var key in keys) {
      if (keys[key][0] !== button[0] || keys[key][1] !== button[1]) {
        newKeys[key] = keys[key];
      }
    }

    const playerGamepadId = this.state.gamepadConfig.playerGamepadId.slice(0);
    const playerId = button[0];
    playerGamepadId[playerId-1] = null;

    this.setState({
      keys: {
        ...newKeys,
        [event.keyCode]: [
          ...button.slice(0, 2),
          event.key.length > 1 ? event.key : String(event.key).toUpperCase()
        ]
      },
      button: undefined,
      gamepadConfig: {
        configs: this.state.gamepadConfig.configs,
        playerGamepadId: playerGamepadId
      },
      controllerIcon: playerGamepadId.map(gamepadId => gamepadId ? GAMEPAD_ICON : KEYBOARD_ICON),
      controllerIconAlt: playerGamepadId.map(gamepadId => gamepadId ? 'gamepad' : 'keyboard'),
      modified: true
    });
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  removeKeyListener() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
        className="ControlsModal"
      >
        <ModalHeader toggle={this.props.toggle}>Controls</ModalHeader>
        <ModalBody>
          <Table>
            <thead>
              <tr>
                <th>Button</th>
                <th>Player 1 <img class="controller-icon" src={this.state.controllerIcon[0]} alt={this.state.controllerIconAlt[0]} /></th>
                <th>Player 2 <img class="controller-icon" src={this.state.controllerIcon[1]} alt={this.state.controllerIconAlt[1]} /></th>
              </tr>
            </thead>
            <tbody>
              <ControlMapperRow
                buttonName="Left"
                button={Controller.BUTTON_LEFT}
                keys={this.state.keys}
                handleClick={this.listenForKey}
                gamepadConfig={this.state.gamepadConfig}
              />
              <ControlMapperRow
                buttonName="Right"
                button={Controller.BUTTON_RIGHT}
                keys={this.state.keys}
                handleClick={this.listenForKey}
                gamepadConfig={this.state.gamepadConfig}
              />
              <ControlMapperRow
                buttonName="Up"
                button={Controller.BUTTON_UP}
                keys={this.state.keys}
                handleClick={this.listenForKey}
                gamepadConfig={this.state.gamepadConfig}
              />
              <ControlMapperRow
                buttonName="Down"
                button={Controller.BUTTON_DOWN}
                keys={this.state.keys}
                handleClick={this.listenForKey}
                gamepadConfig={this.state.gamepadConfig}
              />
              <ControlMapperRow
                buttonName="A"
                button={Controller.BUTTON_A}
                keys={this.state.keys}
                handleClick={this.listenForKey}
                gamepadConfig={this.state.gamepadConfig}
              />
              <ControlMapperRow
                buttonName="B"
                button={Controller.BUTTON_B}
                keys={this.state.keys}
                handleClick={this.listenForKey}
                gamepadConfig={this.state.gamepadConfig}
              />
              <ControlMapperRow
                buttonName="Start"
                button={Controller.BUTTON_START}
                keys={this.state.keys}
                handleClick={this.listenForKey}
                gamepadConfig={this.state.gamepadConfig}
              />
              <ControlMapperRow
                buttonName="Select"
                button={Controller.BUTTON_SELECT}
                keys={this.state.keys}
                handleClick={this.listenForKey}
                gamepadConfig={this.state.gamepadConfig}
              />
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button outline color="primary" onClick={this.props.toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ControlsModal;
