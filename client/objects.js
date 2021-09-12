const BONEID_RIGHT_HAND = 57005;

const registeredObjects = {
	'phone': { objectName: 'p_amb_phone_01', boneID: BONEID_RIGHT_HAND, position: { x: 0.15, y: 0.0, z: -0.043, }, rotation: { x: 15.0, y: 80.0, z: 150 }, 
		enterAnimation: {dict: 'cellphone@', name: 'cellphone_text_in', flag: 49, durationMs: 1000},
		exitAnimation: {dict: 'cellphone@', name: 'cellphone_text_out', flag: 49, durationMs: 1000} }
};

export default registeredObjects;
