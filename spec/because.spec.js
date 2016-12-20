const because = require("../because.js");

describe("because tests", function() {
  it("can be tested with jasmine", function() {
    expect(true).toBe(true);
  });
});

describe("because", function() {
	// "because (value of i)"
	it("allows for simple explanations", () => {
		const cats = "fluffy";

		const log = new because();
		log.info(`cats are ${cats}`);

		log.result(`These are some tests`);

		const why = log.spokenExplanation();

		expect(why).toBe(
			"These are some tests because cats are fluffy."
		);
	});

	it("allows for more than one info to be given", () => {
		const cats = "fluffy";
		const trees = "green";

		const log = new because();

		log.info(`cats are ${cats}`);
		log.extra.info(`trees are ${trees}`);

		log.result(`These are some tests`);

		const why = log.spokenExplanation();

		expect(why).toBe(
			"These are some tests because cats are fluffy " +
			"and trees are green."
		);
	});

	it("can be used for user interface diagnostics", () => {
		const log = new because();

		log.info(`the user clicked a button on the screen`);

		log.info(`the browser made a request to http://some.website`);

		const err = 403;

		log.info(`the browser received ${err} status code`);

		const errMessage = "You are forbidden from making that request!";

		log.extra.info(`the error message returned in the response was "${errMessage}"`);

		log.result(
			`The widget that makes requests to http://some.website ` +
			`experienced an error`
		);

		const why = log.spokenExplanation();

		expect(why).toBe(
			"The widget that makes requests to http://some.website " +
			"experienced an error because the browser received 403 status " +
			"code and the error message returned in the response was \"You " +
			"are forbidden from making that request!\" because the browser " +
			"made a request to http://some.website because the user clicked " +
			"a button on the screen."
		);
	});

	it("can be used to get a more practical log", () => {
		const log = new because();

		log.info(`the database location was given via the CLI`);
		log.info(`the database file was opened`);
		log.info(`the database was read from a file`);
		log.info(`its data was put into internal data structures`);
		log.result(
			`The database was successfully loaded`
		);

		const why = log.structuredExplanation();

		expect(why).toBe(
			"The database was successfully loaded\n" +
			" - the database location was given via the CLI\n" +
			" - the database file was opened\n" +
			" - the database was read from a file\n" +
			" - its data was put into internal data structures"
		);
	});

	it("can be used to generate a customised version of events", () => {
		const log = new because();

		log.info(`the database location was given via the CLI`);
		log.info(`the database file was opened`);
		log.info(`the database was read from a file`);
		log.info(`its data was put into internal data structures`);
		log.result(
			`The database was successfully loaded`
		);

		const why = log.customExplanation((result, reasons) => {
			return `There are ${reasons.length} reasons why ` + result.info.toLowerCase()
		});

		expect(why).toBe(
			"There are 4 reasons why the database was successfully loaded"
		);
	});

	it("can be used in functions", () => {
		const log = new because();

		const doStuff = function() {
			log.result(`Stuff has been done`);
		}

		doStuff();
		log.info(`this test called the doStuff function`);

		const why = log.spokenExplanation();

		expect(why).toBe(
			"Stuff has been done because this test called the doStuff function."
		);
	});

	it("can be used in callbacks", () => {
		const log = new because();

		const cb = function() {
			log.result(`The callback was called`);
		}

		const doCallback = function(cb) {
			log.info(`doCallback was called`);
			cb();
		}

		log.info(`this test called the doCallback function`);
		doCallback(cb);

		const why = log.spokenExplanation();

		expect(why).toBe(
			"The callback was called because doCallback was called because " +
			"this test called the doCallback function."
		);
	});

	it("can speak French", () => {
		const log = new because({
			language : "fr"
		});

		log.info("cela prouve que ce test peut parle le Français");
		log.extra.info("j'aime bien ce langage");

		log.result("C'est fantastique");

		const why = log.spokenExplanation();

		expect(why).toBe(
			"C'est fantastique parce que cela prouve que ce test " +
			"peut parle le Français et j'aime bien ce langage."
		);
	});

	it("can be used in event-based programming", () => {
		const log = new because();

		const EventEmitter = require('events');
		const emitter = new EventEmitter();

		emitter.on('test-event', () => {
			const time = '9am on Tuesday';

			log.result(`The 'test-event' event was fired at ${time}`);
		});

		emitter.emit('test-event');
		log.info(`'test-event' was emitted`);

		const why = log.spokenExplanation();

		expect(why).toBe(
			"The 'test-event' event was fired at 9am on Tuesday " +
			"because 'test-event' was emitted."
		);
	});

	it("can be used to give call site information", () => {
		const log = new because({
			showCallSite: true,
		});

		log.info(`the database location was given via the CLI`);
		log.info(`the database file was opened`);
		log.info(`the database was read from a file`);
		log.info(`its data was put into internal data structures`);
		log.result(
			`The database was successfully loaded`
		);

		const why = log.structuredExplanation();

		expect(why).toBe(
			"The database was successfully loaded\n" +
			" - the database location was given via the CLI\n" +
			"	 at .../because/spec/because.spec.js:205:7\n" +
			" - the database file was opened\n" +
			"	 at .../because/spec/because.spec.js:206:7\n" +
			" - the database was read from a file\n" +
			"	 at .../because/spec/because.spec.js:207:7\n" +
			" - its data was put into internal data structures\n" +
			"	 at .../because/spec/because.spec.js:208:7"
		);
	});

	it("can be used to give conditional history", () => {
		const log = new because();

		for (let i = 0; i < 2; i++) {
			const parity = (i % 2 === 0) ? 'even' : 'odd';
			log.info(`the index is ${i} and it is ${parity}`);
		}

		log.result(
			`The diagnostic has been created`
		);

		const why = log.structuredExplanation();

		expect(why).toBe(
			"The diagnostic has been created\n" +
		    " - the index is 0 and it is even\n" +
    		" - the index is 1 and it is odd"
		);
	});
});
