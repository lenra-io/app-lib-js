export const views = {
	"dir": {
		"inDir": {...{
			"test": "dir.inDir::test",
			"test2": "dir.inDir::test2"
		}, toJSON: () => "dir.inDir"}
	},
	"main": {...{
		"test": "main::test",
		"test2": "main::test2"
	}, toJSON: () => "main"},
	"test2": "test2"
};
export const listeners = {
	"onEnvStart": "onEnvStart",
	"onSessionStart": "onSessionStart",
	"onUserFirstJoin": "onUserFirstJoin"
};
