app.factory("constants", function () {
	return Object.freeze({
		tagScript			: "<Script>",
		tagSection			: "<Section>",
		tagDescription		: "<Description>",

        SECTION_SPLITTER    : "\n\n",
        scriptDefaultName   : "Script",
        imported            : "Successfully imported: ",
		invalidFormat		: "This file format is not supported.",
        unimported          : "Errors occured while importing. Please try again later.",
        emptyString         : "",
        noPendingChanges    : "No pending changes",
        successfulChanges   : " change(s) saved!",
        changesSaved        : "Changes successfully saved",
        cnagesUnsaved       : "Errors occured while saving changes. Please try again later.",
        changesSavig        : "Saving changes...",

        connectSucces		: "Successfully connected with all prompters.",
        cantConnect			: "Errors occured while connecting with prompters. Please try again later.",
        connectedToOperator : "Successfully connected to operator. Waiting for others to connect.",
        allConnected        : "All prompters successfully connected. Broadcast started.",
    	broadcastEnd		: "Broadcast session was ended by operator.",
    	operatorDisconnected: "Broadcast failed. Operator disconnected.",
		lostConnectionWith  : "Lost connection with ",
		allDisconnected		: "All prompters disconnected. Session ended.",

		broadcastTimeout	: 60000,

        sectionsIntroLength : 25,

        defaultFontSize     : 10,
        defaultReadingSpeed : 10,
        defaultAnnouncer: "Default",

        diagnositcsMessageDisplayLength: 100,
        usrerWithSameName: 'User with that name already exists',
        cantDeleteAdmin : 'You cant delete Admin'

    });
});
