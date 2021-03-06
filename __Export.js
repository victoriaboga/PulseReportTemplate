class Export {

    static function isExportMode (context) {
        var state = context.state;
        return (state.ReportExecutionMode == ReportExecutionMode.PdfExport || state.ReportExecutionMode == ReportExecutionMode.ExcelExport);
    }

    static function isExcelExportMode (context) {
        var state = context.state;
        return state.ReportExecutionMode == ReportExecutionMode.ExcelExport;
    }

    static function isPdfExportMode (context) {
        var state = context.state;
        return state.ReportExecutionMode === ReportExecutionMode.PdfExport;
    }

    static function isMassExportMode(context) {
        if(DataSourceUtil.isProjectSelectorNotNeeded(context)) {
            return false;
        } else {
            return DataSourceUtil.getSurveyPropertyValueFromConfig(context, 'configurableExportMode');
        }
    }

    /**
     * diaplay Program/Survey infor pdf export (dropdowns are not rendered in pdf exports)
     * @param {object} {state: state, report: report, text: text, log: log}
     * @return {paramName} str to append to text component
     */
    static function displayDataSourceInfo(context) {

        var state = context.state;
        var log = context.log;
        var str = '';

        if(Config.Surveys.length>1) {
            var selectedProject: Project = DataSourceUtil.getProject(context);
            str+='Program Name: '+selectedProject.ProjectName+' ';
            str += System.Environment.NewLine; // for Excel export
        }


        if(!state.Parameters.IsNull('p_projectSelector')) {

            var selectedSurveys = ParamUtil.GetSelectedOptions (context, 'p_projectSelector');
            if(selectedSurveys.length > 0) {

                var selectedSurveysNames = [];
                for(var i=0; i<selectedSurveys.length; i++) {
                    selectedSurveysNames.push(selectedSurveys[i].Label)
                }

                str += 'Survey(-s): '+selectedSurveysNames.join(',')+' ';
                str = '<div class="data-source-info">'+str+'</div>';
                str += System.Environment.NewLine; // for Excel export
            }
        }
        return str;
    }

    /**
     * render help table to hide unnecessary pages for iterated parameter
     * @param {object} context - {table: table, state: state, report: report,  pageContext: pageContext, log: log}
     * @param {string} parameterId - id of iterated parameter (from pageContext.Items["IteratedParameterBaseParamterId"])
     * @example Export.tableBaseForIteratedParameter_Render({table: table, state: state, report: report, pageContext: pageContext, log: log}, pageContext.Items["IteratedParameterBaseParamterId"]);
     */
    static function tableBaseForIteratedParameter_Render(context, parameterId) {
        var table = context.table;

        var qe: QuestionnaireElement;
        var row : HeaderQuestion;

        var openTextQIds = ParamUtil.GetSelectedCodes (context, parameterId);
        for (var i=0; i<openTextQIds.length; i++) {
            qe = QuestionUtil.getQuestionnaireElement(context, openTextQIds[i]);
            row = new HeaderQuestion(qe);
            row.IsCollapsed = true;
            row.ShowTotals = false;
            row.Distributions.Enabled = true;
            row.Distributions.Count = true;
            table.RowHeaders.Add(row);
        }

        if (openTextQIds.length <= 0) {
            qe = QuestionUtil.getQuestionnaireElement(context, "status");
            row = new HeaderQuestion(qe);
            row.IsCollapsed = true;
            row.ShowTotals = false;
            row.Distributions.Enabled = true;
            row.Distributions.Count = true;
            table.RowHeaders.Add(row);
        }

        var hb: HeaderBase = new HeaderBase();
        table.ColumnHeaders.Add(hb);
    }
}
