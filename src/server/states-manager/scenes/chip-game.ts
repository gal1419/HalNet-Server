import State from '../state';
import { StateManager } from '../services/state-manager';
import scenesService from '../services/scenes-service';
import { ArduinoEvents } from '../constans';

class ChipGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  isArduinoEventReceived: boolean = true;

  readonly sceneName = 'ChipGame';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    this.isArduinoEventReceived = false;
    const clue = scenesService.getSceneClue(this.sceneName);
    this.timer = setTimeout(() => {
      super.loadUnityScene(false, clue);
    }, 1000 * 60 * 3);
  };

  arduinoListener = (data) => {
    if (data === ArduinoEvents.FrameChipRemoved && !this.isArduinoEventReceived) {
      this.isArduinoEventReceived = true;
      clearTimeout(this.timer);
      super.loadUnityScene(false, 'GenesisAfterRemovingChip');
    }
  };
  destroy = (): void => {
    clearTimeout(this.timer);
  };
}

export default new ChipGame();
