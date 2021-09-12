import natives from 'natives';
import alt from 'alt';
import registeredObjects from 'client/objects';

const OBJECT_RANGE = 30;
const CHECK_INTERVAL = 1000;

var currentExistingObjects = [];

function outputMessage(message) {
	console.log('[!] ' + message);
}

function playAnimationOnLocalPlayer(animDictionary, animationName, animationFlag) {
	try{
		if (natives.doesAnimDictExist(animDictionary)) {
			natives.requestAnimDict(animDictionary);

			const animDictLoadInterval = alt.setInterval(() => {
				if (natives.hasAnimDictLoaded(animDictionary)) {
					alt.clearInterval(animDictLoadInterval)
				}
			}, 100)
			
			natives.taskPlayAnim(alt.Player.local.scriptID, animDictionary, animationName, 8.0, 8.0, -1, animationFlag, 1.0, false, false, false);
		} else {
			outputMessage("Animasyon dict'i bulunamadı");
		}
	} catch(e) {
		outputMessage(e.message);
	}
}

function playAnimationSequenceOnLocalPlayer(enterAnimation, exitAnimation, sequenceFinishedCallback) {
	let enterAnimationIsSet = enterAnimation && enterAnimation.dict && enterAnimation.name;
	let exitAnimationIsSet = exitAnimation && exitAnimation.dict && exitAnimation.name;

	let firstAnimation = null;
	let secondAnimation = null;

	if (enterAnimationIsSet) {
		firstAnimation = enterAnimation;
		if (exitAnimationIsSet) {
			secondAnimation = exitAnimation;
		}
	} else if {
		firstAnimation = exitAnimation;
	}
	
	if (firstAnimation) {
		resetAnimationOnLocalPlayer();

		playAnimationOnLocalPlayer(firstAnimation.dict, firstAnimation.name, firstAnimation.flag);

		if (firstAnimation.durationMs && firstAnimation.durationMs > 0) {
			alt.setTimeout(() => {
				if (secondAnimation) {
					playAnimationOnLocalPlayer(secondAnimation.dict, secondAnimation.name, secondAnimation.flag);

					if (secondAnimation.durationMs && secondAnimation.durationMs > 0) {
						alt.setTimeout(() => {
							resetAnimationOnLocalPlayer();
							sequenceFinishedCallback()
						}, secondAnimation.durationMs)
					}
				} else {
					resetAnimationOnLocalPlayer();
					sequenceFinishedCallback();
				}
			}, firstAnimation.durationMs)
		}
	}
}

alt.setInterval(() => {
	try {
		alt.Player.all.forEach(remotePlayer => {
			if (remotePlayer.id == alt.Player.local.id) {
				return;
			}

			var objectOfRemotePlayer = remotePlayer.getSyncedMeta('AttachedObject');

			if (objectOfRemotePlayer) {
				var isRemotePlayerInRange = remotePlayer.scriptID && remotePlayer.pos.isInRange(alt.Player.local.pos, OBJECT_RANGE);

				if (!currentExistingObjects[remotePlayer.id]) {
					if (isRemotePlayerInRange) {
						attachRegisteredObjectToPlayer(remotePlayer, getRegisteredObject(objectOfRemotePlayer));
					}
				} else {
					if(!isRemotePlayerInRange) {
						removeObjectFromPlayer(remotePlayer);
					}
				}
			} else {
				// Kişi önceden obje tutuyorsa sil
				removeObjectFromPlayer(remotePlayer);
			}
		});
	} catch(e) {
		outputMessage(e.message);
	}
}, CHECK_INTERVAL);
/*
function getRegisteredObject(objectName) {
	if (registeredObjects[objectName]) {
		return registeredObjects[objectName];
	} else {
		outputMessage('Obje kayıt edilmemiş: ' + objectName);
		return null;
	}
} */

/* function removeObjectFromPlayer(player) {
	try {
		// Kişinin elindeki silahı gizler
		var object = currentExistingObjects[player.id];
		if (object && natives.doesEntityExist(object)) {
			natives.detachEntity(object, true, true);
			natives.deleteObject(object);
			currentExistingObjects[player.id] = null;
			// Elinde silah varsa silahı tekrar göster
			natives.setPedCurrentWeaponVisible(player.scriptID, true, true, true, true);
		}
	} catch(e) {
		outputMessage(e.message);
	}
} */












