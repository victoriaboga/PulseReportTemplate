class PagePulseSurveyData {

    /**
     * @param {Object} context
     * @param {string} pageId - not mandatory
     */
    static public function tablePulseSurveyContentInfo_Render(context) {

        var log = context.log;
        var report = context.report;
        var table = context.table;
        var key = PulseProgramUtil.getKeyForPulseSurveyContentInfo(context);
        var resources = PulseProgramUtil.pulseSurveyContentInfo[key];

        for(var i=0; i< resources.length; i++) {

            var resource = resources[i];
            var base: HeaderBase = new HeaderBase();
            var header;
            
            if(resource.Type === 'Dimension') { //category;            
              
                header = new HeaderCategorization();
                header.CategorizationId = resource.Code;
                header.DataSourceNodeId = DataSourceUtil.getDsId(context);
                header.Collapsed = true;
                header.Totals = true;
                table.RowHeaders.Add(header); // to avoid case when previous header is added if troubles 

            } else if (resource.Type === 'QuestionId') {  // question id
                
                var questionInfo = QuestionUtil.getQuestionInfo(context, resource.Code);
                var qe: QuestionnaireElement =  QuestionUtil.getQuestionnaireElement(context, resource.Code);
                var questionType;

                //define question type to apply correct header properties later
                (questionInfo.hasOwnProperty('standardType')) ? questionType = questionInfo.standardType : questionType = questionInfo.type;

                /*if(questionType.indexOf('hierarchy')>=0) {
                    header = new HeaderQuestion(qe);
                    header.ReferenceGroup.Enabled = true;
                    header.ReferenceGroup.Self = true;
                    header.ShowTotals = false;
                    table.RowHeaders.Add(header);

                } else */if(questionType.indexOf('multi')>=0) {

                    header = new HeaderQuestion(qe);

                    var mask : MaskFlat = new MaskFlat();
                    mask.IsInclusive = true;
                    header.AnswerMask = mask;
                    header.IsCollapsed = true;
                    header.ShowTotals = true;
                    table.RowHeaders.Add(header);
                  
                } else if(questionType.indexOf('open')>=0) {

                    header = new HeaderQuestion(qe);
                    header.IsCollapsed = true;
                    table.RowHeaders.Add(header);
                } else { // for singles ...

                    header = new HeaderQuestion(qe);
                    header.IsCollapsed = true;
                    header.ShowTotals = false;
                    table.RowHeaders.Add(header);
                }
            }
            
        }

        table.ColumnHeaders.Add(base);
        table.Caching.Enabled = false;
    }
}