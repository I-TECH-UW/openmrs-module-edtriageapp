angular.module("edTriageConceptFactory", [])
    .factory('EdTriageConcept', ['$filter', function ($filter) {
        /**
         * Constructor, with class name
         */
        function EdTriageConcept() {
            var GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID = "060f63dd-9588-4dc2-bf19-c90da02bff15";
            // Public properties, assigned to the instance ('this')
            this.triageQueueStatus =  toAnswers("triageQueueStatus", [
                    toAnswer(EdTriageConcept.status.waitingForEvaluation, "waitingForEvaluation"),
                    toAnswer(EdTriageConcept.status.outpatientConsultation, "outpatientConsultation"),
                    toAnswer(EdTriageConcept.status.leftWithoutBeingSeen, "leftWithoutBeingSeen"),
                    toAnswer(EdTriageConcept.status.removed, "remove"),
                    toAnswer(EdTriageConcept.status.expired, "expire")]
                , "9dbc0bfa-193e-4fc4-a1e3-3b1475ff305d");
            this.triageColorCode =  toAnswers("triageColorCode", [
                    toAnswer(EdTriageConcept.score.red, "red"),
                    toAnswer(EdTriageConcept.score.green, "green"),
                    toAnswer(EdTriageConcept.score.yellow, "yellow"),
                    toAnswer(EdTriageConcept.score.orange, "orange")]
                , "1d1ab94d-9242-467a-bb69-774cb7abcde4");
            this.triageScore = toAnswer("e1445950-2633-4012-9f39-1446361d1773", "score");
            this.triageWaitingTime = toAnswer("0a84ea93-e057-4643-abe6-dca97426da8d", "triageWaitingTime");
            this.chiefComplaint = toAnswer("160531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "chiefComplaint");
            this.clinicalImpression = toAnswer("159395AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "clinicalImpression");
            this.labs = {
                glucose: toAnswer("887AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "glucose", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }

                    if(ageType == EdTriageConcept.ageType.INFANT){
                        if ( value < 54 ) return { numericScore: 0, colorCode: EdTriageConcept.score.red };
                        return {numericScore: 0, colorCode: EdTriageConcept.score.green};
                    } else {
                        if ( value < 60 ) { return {numericScore: 0, colorCode: EdTriageConcept.score.red} };
                        if ( (value > 300) && ( value <= 450) ) {
                             return { numericScore: 0, colorCode: EdTriageConcept.score.yellow };
                        }
                        if ( value > 450 ) {
                            return { numericScore: 0, colorCode: EdTriageConcept.score.orange };
                        }
                        return {numericScore: 0, colorCode: EdTriageConcept.score.green};
                    }
                }),
                lowGlucoseLevel: toAnswers('lowGlucoseLevel',
                    [toAnswer("1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "lowGlucoseLevel", function(ageType, value) {
                        if (value.length > 0) {
                            return {numericScore: 0, colorCode: EdTriageConcept.score.red};
                        } else {
                            return {numericScore: 0, colorCode: EdTriageConcept.score.green};
                        }
                    })],
                    "d6b53c01-ef95-412f-a7dd-287e6d94aa1e"),
                highGlucoseLevel: toAnswers('highGlucoseLevel',
                    [ toAnswer("1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","highGlucoseLevel", function(ageType, value) {
                        if (value.length > 0) {
                            if(ageType == EdTriageConcept.ageType.CHILD || ageType == EdTriageConcept.ageType.ADULT){
                                return {numericScore: 0, colorCode: EdTriageConcept.score.orange};
                            }
                        }
                        return {numericScore: 0, colorCode: EdTriageConcept.score.green};
                    }) ],
                    "d27cee7f-a4ad-4552-a1e0-7873d79de178"),
                pregnancy_test: toAnswers('pregnancy_test',
                    [toAnswer("703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","positive", {numericScore: 0}, 'A'),
                     toAnswer("664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","negative", {numericScore: 0}, 'A')],
                    "1945AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
            };

            this.treatment = {
                oxygen: toAnswers('oxygen',
                    [ toAnswer("81341AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","oxygen") ],
                    "ba05cd0f-f656-4e9f-87db-c93f8303623b"),
                paracetamol: toAnswers('paracetamol',
                    [ toAnswer("70116AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","paracetamol") ],
                    "ba05cd0f-f656-4e9f-87db-c93f8303623b"),
                paracetamolDose: toAnswer("4bbd196b-fd51-43cb-b8e1-21f14035a76d", "paracetamolDose")
            }

            this.vitals = {
                mobility: toAnswers('mobility',
                    [toAnswer("59c854da-b1be-4455-9ec2-8fa838c193d1", "immobile", { numericScore: 2, colorCode: EdTriageConcept.score.green}, null, 4),
                        toAnswer("2f9fcdbc-413c-47da-881d-6ecd0984876f", "with help", { numericScore: 1, colorCode: EdTriageConcept.score.green }, 'AC', 2),
                        toAnswer("159310AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "walking", { numericScore: 0, colorCode: EdTriageConcept.score.green } , 'AC', 1),
                        toAnswer("1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "normal for age", { numericScore: 0, colorCode: EdTriageConcept.score.green } , EdTriageConcept.ageType.INFANT, 3)]
                    , "c50be7a4-410b-4514-baf8-35358b5860c3"),
                respiratoryRate: toAnswer("5242AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "respiratoryRate", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.ADULT){
                        if(value < 9) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 15) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 21) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        if(value < 30) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.CHILD){
                        if(value < 15) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 17) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 22) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 27) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.INFANT){
                        if(value < 20) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 26) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 40) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 50) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                    }
                }),
                oxygenSaturation: toAnswer("5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "oxygenSaturation", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if (ageType == EdTriageConcept.ageType.ADULT) {
                        if(value < 85) { return { numericScore: 0, colorCode: EdTriageConcept.score.red }; }
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    else {
                        if(value < 92) { return { numericScore: 0, colorCode: EdTriageConcept.score.red }; }
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                }),
                heartRate: toAnswer("5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "heartRate", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if ( value == 0 ) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.blue };
                    }
                    if(ageType == EdTriageConcept.ageType.ADULT){
                        if(value < 41) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 51) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        if(value < 101) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 111) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        if(value < 130) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 146) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 3, colorCode: EdTriageConcept.score.red };
                    }
                    if(ageType == EdTriageConcept.ageType.CHILD){
                        if(value < 60) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 80) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 100) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 130) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.INFANT){
                        if(value < 70) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 80) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 131) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        if(value < 160) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                    }
                }),
                systolicBloodPressure: toAnswer("5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "systolicBloodPressure", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if(ageType == EdTriageConcept.ageType.ADULT){
                        if(value < 71) return { numericScore: 3, colorCode: EdTriageConcept.score.green };
                        if(value < 81) return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                        if(value < 101) return { numericScore: 1, colorCode: EdTriageConcept.score.green };
                        if(value < 200) return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                        return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                    }
                    return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                }, EdTriageConcept.ageType.ADULT),
                diastolicBloodPressure: toAnswer("5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "diastolicBloodPressure", function(ageType, value){
                    return  { numericScore: 0, colorCode: EdTriageConcept.score.green };
                }, EdTriageConcept.ageType.ADULT),
                temperature: toAnswer("5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "temperature", function(ageType, value){
                    if (!isNumber(value)) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    if(value < 35) {
                        return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                    }
                    if(value <= 38.4) {
                        return { numericScore: 0, colorCode: EdTriageConcept.score.green };
                    }
                    return { numericScore: 2, colorCode: EdTriageConcept.score.green };
                }),
                consciousness: toAnswers(        'consciousness',
                    [toAnswer("3cf27e66-26fe-102b-80cb-0017a47871b2", "confusion", { numericScore: 2, colorCode: EdTriageConcept.score.green }, 'AC', 1),
                        toAnswer("160282AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "alert",  { numericScore: 0, colorCode: EdTriageConcept.score.green }, null, 2),
                        toAnswer("162645AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "reacts to voice", { numericScore: 1, colorCode: EdTriageConcept.score.green }, null, 3),
                        toAnswer("162644AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "responds to pain", { numericScore: 2, colorCode: EdTriageConcept.score.green }, null, 4),
                        toAnswer("f7a1fd17-f12d-48c1-b3dd-8e9fc95c8100", "unresponsive",  { numericScore: 3, colorCode: EdTriageConcept.score.green }, null, 5)],
                    GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                trauma: toAnswers('trauma', [toAnswer("	124193AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "trauma", function(ageType, value){
                    return value.length > 0 ?  { numericScore: 1, colorCode: EdTriageConcept.score.green } :  { numericScore: 0, colorCode: EdTriageConcept.score.green };})],
                    GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                weight: toAnswer("5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "weight", function(ageType, value){
                    return  { numericScore: 0, colorCode: EdTriageConcept.score.green };
                })
            } ;


            this.symptoms = {
                emergencySigns: toAnswers('emergencySigns',[
                        toAnswer("164348AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "impaired airway",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 1),
                        toAnswer("3cedf31e-26fe-102b-80cb-0017a47871b2", "impaired breathing",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 2),
                        toAnswer("911c064e-5247-4017-a9fd-b30105c36052", "shock",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 3),]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                neurological: toAnswers('neurological',[
                    toAnswer("113054AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "seizure - convulsive",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 1),
                    toAnswer("de72a69a-8f78-4bf1-830a-6915e1d7c607", "seizure - post convulsive",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 2),
                    toAnswer("163410AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "acute focal neurologic deficit",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 3),
                    toAnswer("118877AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "level of consciousness reduced",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 4),
                    toAnswer("113517AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "psychosis",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'AC', 5),
                    toAnswer("140054AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "infantile hypotonia",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.INFANT, 6),
                    toAnswer("143582AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "prolonged crying",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.INFANT, 7)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                burn: toAnswers('burn',[
                    toAnswer("120977AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "burn - face/head/neck",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, null, 1),
                    toAnswer("163476AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "significant burn of skin was (burn over 20% or circumferential)",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 2),
                    toAnswer("145727AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "Burn - electrical or chemical", { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 3),
                    toAnswer("116543AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "burn-other",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 4)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                diabetic: toAnswers('diabetic',[
                    toAnswer("163486AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "Ketonuria",  { numericScore: 0, colorCode: EdTriageConcept.score.green }, 'AC')]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                trauma: toAnswers('trauma',[
                    toAnswer("37f88bdb-44b5-4d1c-835f-5ba174bcf580", "serious trauma",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 1),
                    toAnswer("163479AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "threatened limb",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 2),
                    toAnswer("163480AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "dislocation of larger joint (not finger or toe)",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 3),
                    toAnswer("132338AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "open fracture",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 4),
                    toAnswer("163482AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "haemorrhage - uncontrolled",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 5),
                    toAnswer("0b05c6a7-7bbe-4b67-ab58-84b1cc2ce7fc", "Cannot support any weight",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.INFANT, 6),
                    toAnswer("163481AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "dislocation of finger or toe",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 7),
                    toAnswer("139899AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "fracture - closed",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 8),
                    toAnswer("163483AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "haemorrhage - controlled",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 9)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                digestive: toAnswers('digestive',[
                    toAnswer("139006AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "vomiting - fresh blood",  { numericScore: 0, colorCode: EdTriageConcept.score.orange}, EdTriageConcept.ageType.ADULT, 1),
                    toAnswer("130334AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "vomiting - persistent",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.ADULT, 2),
                    toAnswer("139582AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "Gastrointestinal hemorrhage",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 3),
                    toAnswer("163484AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "refuses to feed/drink",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.INFANT, 6),
                    toAnswer("122983AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "Vomiting", { numericScore: 0, colorCode: EdTriageConcept.score.yellow },'CI', 4),
                    toAnswer("0948f776-1917-4608-a2e4-ee31a1a2764d", "Persistent diarrhea", { numericScore: 0, colorCode: EdTriageConcept.score.yellow },'CI', 5)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                pregnancy: toAnswers('pregnancy',[
                    toAnswer("153551AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "pregnancy & abdominal trauma or pain",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 1),
                    toAnswer("117617AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "pregnancy & trauma or vaginal bleeding",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 2 )]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                respiratory: toAnswers('respiratory',[
                    toAnswer("118478AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "hypersalivation",  { numericScore: 0, colorCode: EdTriageConcept.score.red }, 'CI', 1),
                    toAnswer("136119AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "stridor",  function(ageType, value) {
                        if (ageType == EdTriageConcept.ageType.INFANT) {
                            return { numericScore: 0, colorCode: EdTriageConcept.score.red };
                        } else if (ageType == EdTriageConcept.ageType.CHILD) {
                            return { numericScore: 0, colorCode: EdTriageConcept.score.orange };
                        }
                    }, 'I', 2),
                    toAnswer("122496AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "dyspnea-shortness of breath",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'I', 3),
                    toAnswer("122496AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "dyspnea-shortness of breath",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'C', 4),
                    toAnswer("136119AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "stridor",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'C', 5),
                    toAnswer("5209AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "sibilance",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 6),
                    toAnswer("163485AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "shortness of breath - acute",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 7),
                    toAnswer("ca679c78-e05f-4d08-8baf-be0659f09c02", "coughing blood ",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 8)
                    ]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                pain: toAnswers('pain',[
                    toAnswer("d092c376-5f89-4abd-a6ec-8632587b797b", "severe pain",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 1),
                    toAnswer("10008d98-6653-47fb-b171-02e0f257e875", "moderate pain",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 3),
                    toAnswer("3ccd2364-26fe-102b-80cb-0017a47871b2", "chest pain",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.ADULT, 2),
                    toAnswer("3ccdf8d4-26fe-102b-80cb-0017a47871b2", "abdominal pain",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, null, 4)
                    ]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID),
                other: toAnswers('other',[
                    toAnswer("3ccccc20-26fe-102b-80cb-0017a47871b2", "toxicity-Poisoning/overdose",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, null, 1),
                    toAnswer("15bd52f1-a35b-489d-a283-ece958c4ef1e", "purpura",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, 'CI', 2),
                    toAnswer("8084b7b2-adc4-4b83-aafc-647d1308c988", "drowsiness",  { numericScore: 0, colorCode: EdTriageConcept.score.orange }, EdTriageConcept.ageType.CHILD, 3),
                    toAnswer("137646AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "incoherent story (or history)",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, 'CI', 4),
                    toAnswer("148566AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "anuria",  { numericScore: 0, colorCode: EdTriageConcept.score.yellow }, EdTriageConcept.ageType.INFANT, 5)]
                    ,GENERIC_TRIAGE_SYMPTOM_CONCEPT_SET_UUID)

            }
        }

        function toAnswers(messageKey, answers, uuid) {
            // var key = "edtriageapp.i18n." + messageKey;
            // var translation = $filter('translate')(key);
            // //TODO:  this is just until we figure out the translations, so things are sort of readable
            // if(key == translation){
            //     translation = key.split(".")[2] + "{??}";
            // }
            return {answers: answers, label:messageKey, value: null, uuid:uuid};
        }

        function toAnswer(uuid, label, score, scope, displayOrder) {
            var scoreFunction = score;
            if (typeof scoreFunction !== "function") {
                scoreFunction = function(){
                    return score
                };
            }

            return {uuid: uuid, label: label, score: scoreFunction, scope: scope == null ? EdTriageConcept.ageType.ALL : scope, value: null,
            labelTranslated:function(ageType){
                return $filter('translate')(this.label, this.uuid, ageType);
            }, displayOrder: displayOrder == null ? 1 : displayOrder};
        }

        function isNumber(obj) {
            return !isNaN(parseFloat(obj));
        }
        
        //some static vars for the scores for symptoms
        EdTriageConcept.score = {
            blue: "	f4d69199-00b3-449d-ad90-b82aa306002f",
            red: "7e5f97c9-2eaa-476d-afa6-6017095964d6",
            orange: "4563ae8e-c007-4fb6-a215-eb1118737c59",
            yellow: "c3b7e63a-a478-40ca-8fe6-0bbcce1746c9",
            green: "88bae566-8147-456a-9021-ee41c66ac22f"
        };

        EdTriageConcept.status = {
            waitingForEvaluation: "90b571f3-5a4e-4634-903b-e322888c469a",
            outpatientConsultation: "160542AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            leftWithoutBeingSeen: "3bf7cce1-45fc-4939-96f5-f9e0d3e42e9a",
            removed: "8d1825cb-8e46-446c-9365-a87fd815a5e7",
            expired: "99928547-6b1e-4ccf-9a43-2c71c527f8eb"
        };

        EdTriageConcept.heartRate = "5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
        EdTriageConcept.respiratoryRate = "5242AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
        EdTriageConcept.oxygenSaturation = "5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
        EdTriageConcept.numericScore = "e1445950-2633-4012-9f39-1446361d1773";

        EdTriageConcept.lowGlucoseLevel = {
            yes: "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        };

        EdTriageConcept.highGlucoseLevel = {
            yes: "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        };

        EdTriageConcept.ageType = {
            ADULT: 'A',
            CHILD: 'C',
            INFANT: 'I',
            ALL: 'ACI'
        };
        
        // UHM-2669, define the wait times(in minutes) that would trigger blinking in the waiting queue
        EdTriageConcept.waitTimesConfig = {
            blue:0,
            red: 1,
            orange: 10,
            yellow: 60,
            green: 240
        };

        /**
         * Static method, assigned to class
         * Instance ('this') is not available in static context
         */
        EdTriageConcept.build = function (data, existingConcept) {

            var ret =existingConcept;
            if(existingConcept == null){
                ret = new EdTriageConcept();
            }

            updateConceptLabels(ret, data, 0);

            return ret;
            
            /* 
            updates the concepts labels with the translated text from the web service
            * */
            function updateConceptLabels(obj, data, level) {
                for (var propertyName in obj) {
                    var p = obj[propertyName];
                    if (p != null && typeof p == "object") {
                        if (p.hasOwnProperty('uuid')) {
                            //this an answer to a question, so let's look for a UUID that matches in the data and set the label for this
                            updateAnswerLabel(p, data);
                            if(p.hasOwnProperty("answers")){
                                //this also has some answers, so load those too
                                for (var i = 0; i < p.answers.length; ++i) {
                                    updateAnswerLabel(p.answers[i], data)
                                }
                            }
                        }
                        else if (propertyName == 'answers') {
                            //this is an array of answers, iterate
                            for (var i = 0; i < p.length; ++i) {
                                updateAnswerLabel(p[i], data)
                            }
                        }
                        else {
                            //this is some other property, check it's properties
                            updateConceptLabels(p, data, level +1);
                        }
                    }
                    else{
                        //NOTHING TO DO
                    }

                }
            }
            /* 
             updates the answer labels with the translated text from the web service
             * */
            function updateAnswerLabel(obj, data) {
                for (var i = 0; i < data.length; ++i) {
                    var concept = data[i];
                    //first look in the object for the uuid
                    if (concept.uuid == obj.uuid) {
                        obj.label = concept.display;
                        return;
                    }
                    //then check if the object has answers we can check
                    if(concept.answers != null && concept.answers.length>0){
                        for(var j=0;j<concept.answers.length;++j){
                            var a = concept.answers[j];
                            if(a.uuid == obj.uuid){
                                obj.label = a.display;
                                return;

                            }
                        }
                    }

                    if(concept.setMembers != null && concept.setMembers.length>0){
                        for(var j=0;j<concept.setMembers.length;++j){
                            var a = concept.setMembers[j];
                            if(a.uuid == obj.uuid){
                                obj.label = a.display;
                                return;

                            }
                        }
                    }

                }
            }
        };

        EdTriageConcept.findAnswer = function(concept, uuid){
            for (var propertyName in concept) {
                var p = concept[propertyName];
                if (p != null && typeof p == "object") {
                    if (p.hasOwnProperty('uuid')) {
                        if (p.uuid == uuid) {
                            //we found something, return the answer
                            return p;
                        }
                    }
                    else if (propertyName == 'answers') {
                        //this is an array of answers, iterate
                        for (var i = 0; i < p.length; ++i) {
                            var t = EdTriageConcept.findAnswer(p[i], data);
                            if(t != null){
                                return t;
                            }
                        }
                    }
                    else {
                        //this is some other property, check it's properties
                        var t  = EdTriageConcept.findAnswer(p, data, level +1);
                        if(t != null){
                            return t;
                        }
                    }
                }
                else{
                    //NOTHING TO DO just skip this property
                }

            }
        } ;


        /**
         * Return the constructor function
         */
        return EdTriageConcept;
    }]);
