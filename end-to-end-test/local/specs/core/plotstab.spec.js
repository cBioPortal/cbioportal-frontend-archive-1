var assert = require('assert');
var goToUrlAndSetLocalStorage = require('../../../shared/specUtils')
    .goToUrlAndSetLocalStorage;
var useExternalFrontend = require('../../../shared/specUtils')
    .useExternalFrontend;
var waitForPlotsTab = require('../../../shared/specUtils').waitForPlotsTab;
var assertScreenShotMatch = require('../../../shared/lib/testUtils')
    .assertScreenShotMatch;
var selectReactSelectOption = require('../../../shared/specUtils')
    .selectReactSelectOption;

const CBIOPORTAL_URL = process.env.CBIOPORTAL_URL.replace(/\/$/, '');

describe('plots tab', function() {
    describe('utilities menu', function() {
        it('is shown when plot data available', function() {
            loadPlotsTab(
                `${CBIOPORTAL_URL}/results/plots?Action=Submit&RPPA_SCORE_THRESHOLD=2.0&Z_SCORE_THRESHOLD=2.0&cancer_study_list=study_es_0&case_set_id=study_es_0_all&clinicallist=NUM_SAMPLES_PER_PATIENT%2CPROFILED_IN_study_es_0_mutations%2CPROFILED_IN_study_es_0_gistic%2CPROFILED_IN_study_es_0_mrna_median_Zscores&data_priority=0&gene_list=RPS11&geneset_list=%20&genetic_profile_ids_PROFILE_COPY_NUMBER_ALTERATION=study_es_0_gistic&genetic_profile_ids_PROFILE_MRNA_EXPRESSION=study_es_0_mrna_median_Zscores&genetic_profile_ids_PROFILE_MUTATION_EXTENDED=study_es_0_mutations&show_samples=false&tab_index=tab_visualize`
            );
            assert($('div.color-samples-toolbar-elt').isExisting());
        });

        it('is hidden when plot data unavailable', function() {
            goToUrlAndSetLocalStorage(
                `${CBIOPORTAL_URL}/results/plots?Action=Submit&RPPA_SCORE_THRESHOLD=2.0&Z_SCORE_THRESHOLD=2.0&cancer_study_list=study_es_0&case_set_id=study_es_0_all&clinicallist=NUM_SAMPLES_PER_PATIENT%2CPROFILED_IN_study_es_0_mutations%2CPROFILED_IN_study_es_0_gistic%2CPROFILED_IN_study_es_0_mrna_median_Zscores&data_priority=0&gene_list=AR%2520RPS11&geneset_list=%20&genetic_profile_ids_PROFILE_COPY_NUMBER_ALTERATION=study_es_0_gistic&genetic_profile_ids_PROFILE_MRNA_EXPRESSION=study_es_0_mrna_median_Zscores&genetic_profile_ids_PROFILE_MUTATION_EXTENDED=study_es_0_mutations&show_samples=false&tab_index=tab_visualize`,
                true
            );
            $('div[data-test="PlotsTabNoDataDiv"]').waitForDisplayed();
            assert(true);
        });

        it('shows gene selection box and radio buttons in clinical attribute vs treatment plot', () => {
            loadPlotsTab(
                `${CBIOPORTAL_URL}/results/plots?Action=Submit&RPPA_SCORE_THRESHOLD=2.0&Z_SCORE_THRESHOLD=2.0&cancer_study_list=study_es_0&case_set_id=study_es_0_all&clinicallist=NUM_SAMPLES_PER_PATIENT%2CPROFILED_IN_study_es_0_mutations%2CPROFILED_IN_study_es_0_gistic%2CPROFILED_IN_study_es_0_mrna_median_Zscores&data_priority=0&gene_list=RPS11&geneset_list=%20&genetic_profile_ids_PROFILE_COPY_NUMBER_ALTERATION=study_es_0_gistic&genetic_profile_ids_PROFILE_MRNA_EXPRESSION=study_es_0_mrna_median_Zscores&genetic_profile_ids_PROFILE_MUTATION_EXTENDED=study_es_0_mutations&heatmap_track_groups=study_es_0_treatment_ic50%2CErlotinib&show_samples=false&tab_index=tab_visualize&treatment_list=Erlotinib`
            );
            selectTreatmentProfile();
            assert($('div.coloring-menu').isExisting());
            assert(
                $('div.coloring-menu').$$('input[type="checkbox"]').length === 3
            );
        });

        it('shows mutation and copy number by default', () => {
            loadPlotsTab(
                `${CBIOPORTAL_URL}/results/plots?Action=Submit&RPPA_SCORE_THRESHOLD=2.0&Z_SCORE_THRESHOLD=2.0&cancer_study_list=study_es_0&case_set_id=study_es_0_all&clinicallist=NUM_SAMPLES_PER_PATIENT%2CPROFILED_IN_study_es_0_mutations%2CPROFILED_IN_study_es_0_gistic%2CPROFILED_IN_study_es_0_mrna_median_Zscores&data_priority=0&gene_list=RPS11&geneset_list=%20&genetic_profile_ids_PROFILE_COPY_NUMBER_ALTERATION=study_es_0_gistic&genetic_profile_ids_PROFILE_MRNA_EXPRESSION=study_es_0_mrna_median_Zscores&genetic_profile_ids_PROFILE_MUTATION_EXTENDED=study_es_0_mutations&heatmap_track_groups=study_es_0_treatment_ic50%2CErlotinib&show_samples=false&tab_index=tab_visualize&treatment_list=Erlotinib&plots_horz_selection=%7B"dataType"%3A"clinical_attribute"%7D&plots_vert_selection=%7B"selectedGeneOption"%3A6205%2C"dataType"%3A"TREATMENT_RESPONSE"%7D&plots_coloring_selection=%7B%7D&profileFilter=0`
            );
            selectTreatmentProfile();
            const res = browser.checkElement('[id=plots-tab-plot-svg]');
            assertScreenShotMatch(res);
        });

        it('shows only mutation types when copy number is de-selected', () => {
            loadPlotsTab(
                `${CBIOPORTAL_URL}/results/plots?Action=Submit&RPPA_SCORE_THRESHOLD=2.0&Z_SCORE_THRESHOLD=2.0&cancer_study_list=study_es_0&case_set_id=study_es_0_all&clinicallist=NUM_SAMPLES_PER_PATIENT%2CPROFILED_IN_study_es_0_mutations%2CPROFILED_IN_study_es_0_gistic%2CPROFILED_IN_study_es_0_mrna_median_Zscores&data_priority=0&gene_list=RPS11&geneset_list=%20&genetic_profile_ids_PROFILE_COPY_NUMBER_ALTERATION=study_es_0_gistic&genetic_profile_ids_PROFILE_MRNA_EXPRESSION=study_es_0_mrna_median_Zscores&genetic_profile_ids_PROFILE_MUTATION_EXTENDED=study_es_0_mutations&heatmap_track_groups=study_es_0_treatment_ic50%2CErlotinib&show_samples=false&tab_index=tab_visualize&treatment_list=Erlotinib&plots_horz_selection=%7B"dataType"%3A"clinical_attribute"%7D&plots_vert_selection=%7B"selectedGeneOption"%3A6205%2C"dataType"%3A"TREATMENT_RESPONSE"%7D&plots_coloring_selection=%7B"colorByCopyNumber"%3A"false"%2C"colorBySv"%3A"false"%7D&profileFilter=0`
            );
            selectTreatmentProfile();
            $('input[data-test="ViewCopyNumber"]').click();
            const res = browser.checkElement('[id=plots-tab-plot-svg]');
            assertScreenShotMatch(res);
        });

        it('shows only CNA types when mutation checkbox is deselected', () => {
            loadPlotsTab(
                `${CBIOPORTAL_URL}/results/plots?Action=Submit&RPPA_SCORE_THRESHOLD=2.0&Z_SCORE_THRESHOLD=2.0&cancer_study_list=study_es_0&case_set_id=study_es_0_all&clinicallist=NUM_SAMPLES_PER_PATIENT%2CPROFILED_IN_study_es_0_mutations%2CPROFILED_IN_study_es_0_gistic%2CPROFILED_IN_study_es_0_mrna_median_Zscores&data_priority=0&gene_list=RPS11&geneset_list=%20&genetic_profile_ids_PROFILE_COPY_NUMBER_ALTERATION=study_es_0_gistic&genetic_profile_ids_PROFILE_MRNA_EXPRESSION=study_es_0_mrna_median_Zscores&genetic_profile_ids_PROFILE_MUTATION_EXTENDED=study_es_0_mutations&heatmap_track_groups=study_es_0_treatment_ic50%2CErlotinib&show_samples=false&tab_index=tab_visualize&treatment_list=Erlotinib&plots_horz_selection=%7B"dataType"%3A"clinical_attribute"%7D&plots_vert_selection=%7B"selectedGeneOption"%3A6205%2C"dataType"%3A"TREATMENT_RESPONSE"%7D&plots_coloring_selection=%7B"colorByMutationType"%3A"false"%2C"colorBySv"%3A"false"%7D&profileFilter=0`
            );
            selectTreatmentProfile();
            $('input[data-test="ViewMutationType"]').click();
            const res = browser.checkElement('[id=plots-tab-plot-svg]');
            assertScreenShotMatch(res);
        });

        it('removes sample stylings when selecting None in gene selection box', () => {
            loadPlotsTab(
                `${CBIOPORTAL_URL}/results/plots?Action=Submit&RPPA_SCORE_THRESHOLD=2.0&Z_SCORE_THRESHOLD=2.0&cancer_study_list=study_es_0&case_set_id=study_es_0_all&clinicallist=NUM_SAMPLES_PER_PATIENT%2CPROFILED_IN_study_es_0_mutations%2CPROFILED_IN_study_es_0_gistic%2CPROFILED_IN_study_es_0_mrna_median_Zscores&data_priority=0&gene_list=RPS11&geneset_list=%20&genetic_profile_ids_PROFILE_COPY_NUMBER_ALTERATION=study_es_0_gistic&genetic_profile_ids_PROFILE_MRNA_EXPRESSION=study_es_0_mrna_median_Zscores&genetic_profile_ids_PROFILE_MUTATION_EXTENDED=study_es_0_mutations&heatmap_track_groups=study_es_0_treatment_ic50%2CErlotinib&show_samples=false&tab_index=tab_visualize&treatment_list=Erlotinib&plots_horz_selection=%7B"dataType"%3A"clinical_attribute"%7D&plots_vert_selection=%7B"dataType"%3A"TREATMENT_RESPONSE"%7D&plots_coloring_selection=%7B"selectedOption"%3A"6205_undefined"%7D&profileFilter=0`
            );
            selectTreatmentProfile();
            $('.gene-select').click();
            // select gene menu entries
            var geneMenuEntries = $('[data-test=GeneColoringMenu]')
                .$('div=Genes')
                .$('..')
                .$$('div')[1]
                .$$('div');
            geneMenuEntries[0].click();
            $('[data-test=PlotsTabPlotDiv]').waitForDisplayed();
            const res = browser.checkElement('[id=plots-tab-plot-svg]');
            assertScreenShotMatch(res);
        });
    });
});

var loadPlotsTab = url => {
    goToUrlAndSetLocalStorage(url, true);
    $('div[data-test="PlotsTabPlotDiv"]').waitForDisplayed();
};

var selectTreatmentProfile = () => {
    const vertDataSelect = $('[name=v-profile-type-selector]').$('..');
    selectReactSelectOption(vertDataSelect, 'Treatment Response');
    $('div[data-test="PlotsTabPlotDiv"]').waitForDisplayed();
};
