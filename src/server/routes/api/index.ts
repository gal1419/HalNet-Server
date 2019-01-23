import express from "express";
import * as passportConfig from "../../config/passport";
import UnityRestService from "../../services/unity-rest-service";
import StateManager from "../../states-manager/services/state-manager";
import scenesService from "../../states-manager/services/scenes-service";
import commandService from "../../services/commands-service";
import unityRestService from "../../services/unity-rest-service";

const apiRouter = express.Router();

const stateManager = StateManager.getInstance();

const loadScene = (req, res, next) => {
  const { sceneName } = req.body;
  const scene = scenesService.getSceneByName(sceneName);

  if (!scene) {
    res.status(404).json({ msg: "Scene not found" });
    return;
  }

  stateManager.setState(scene);
  stateManager.execute();
  res.status(200).json({ msg: "OK" });
};

const loadSceneGet = (req, res, next) => {
  const sceneName = req.params.scene_name;
  const stateManager = StateManager.getInstance();
  const scene = scenesService.getSceneByName(sceneName);

  if (!scene) {
    res.status(404).json({ msg: "Scene not found" });
    return;
  }

  stateManager.setState(scene);
  stateManager.execute();
  res.status(200).json({ msg: "OK" });
};

/**
 * POST /api/load-scene
 * Start the game
 */
apiRouter.post("/load-scene", loadScene);

apiRouter.get("/load-scene/:scene_name", loadSceneGet);

apiRouter.post("/unity", (req, res) => {
  console.log('got unity');
  stateManager.handleRestRequest(req, res);
});

apiRouter.get("/end-scene", (req, res) => {
  console.log('got end-scene');
  stateManager.endScene(req, res);
});

apiRouter.get("/current-state", (req, res) => {
  stateManager.getCurrentStateName(req, res);
});

apiRouter.get("/scene-names-order", (req, res) => {
  const sceneNames = scenesService.getScenesNameByOrder();
  console.log(sceneNames);
  res.status(200).json(sceneNames);
});

apiRouter.get("/arduino/:event", (req, res) => {
  const { event } = req.params;
  console.log('got arduino event from rest: ' + event);
  stateManager.handleArduinoMessage(event);
  res.status(200).json({ msg: "OK" });
});

apiRouter.get("/commands/:command/:user_uniqueness", (req, res) => {
  const command = req.params.command;
  console.log('got command event from rest: ' + command);
  commandService.runCommand(req, res);
});

apiRouter.get("/commands", (req, res) => {
  commandService.getCommands(req, res);
});

apiRouter.get("/show-code", (req, res) => {
  console.log('got ShowCode event from rest');
  unityRestService.sendTheardUnityMessage("load-scene", "ShowCode");
  res.status(200).json({ msg: "OK" });
});

apiRouter.get("/volume/:command", (req, res) => {
  const { command } = req.params;
  console.log('got volume event from rest:' + command);
  unityRestService.sendPrimaryUnityMessage("load-scene", command);
  res.status(200).json({ msg: "OK" });
});

export default apiRouter;
