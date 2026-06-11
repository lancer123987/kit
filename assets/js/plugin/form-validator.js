/**
 * 依據驗證設定物件執行表單驗證
 * @param {{
 *   form: jQuery,
 *   fields: Array<{
 *     name?: string,
 *     id?: string,
 *     errorKey: string,
 *     condition: Function
 *   }>,
 *   groups: Array<{
 *     itemSelector: string,
 *     fields: Array<{
 *       namePrefix: string,
 *       errorKeyPrefix: string,
 *       condition: Function
 *     }>
 *   }>=
 * }} config
 *
 * @returns {Object}
 */
function validateFields(config) {

    const VALIDATOR = {
        select: ($el) => -1 == $el.val(),
        radio: ($el) => -1 == $el.filter(':checked').val(),
        checkbox: ($el) => 0 == $el.filter(':checked').length,
        textarea: ($el) => '' == $el.val().trim(),
        input: ($el) => '' == $el.val().trim()
    };

    /**
     * @param {jQuery} $el
     * @returns {string}
     */
    function getValidatorKey($el) {
        let tag = $el.prop('tagName').toLowerCase();
        if ('input' === tag) {
            let type = ($el.attr('type') || 'text').toLowerCase();
            return ('radio' === type || 'checkbox' === type) ? type : 'input';
        }
        return tag;
    }

    /**
     * @param {jQuery} $container
     * @param {string} selector
     * @param {string} errorKey
     * @param {Function|undefined} condition
     */
    function validateField($container, selector, errorKey, condition) {
        if (condition && !condition()) return;

        let $el = $container.find(selector);
        if (0 === $el.length) return;

        let key = getValidatorKey($el.first());

        if (VALIDATOR[key] && VALIDATOR[key]($el)) {
            error[errorKey] = true;
        }
    }

    let error = {};

    config.fields.forEach(({ name, id, errorKey, condition }) => {
        let selector = id ? `#${id}` : `[name="${name}"]`;
        validateField(config.form, selector, errorKey, condition);
    });

    (config.groups || []).forEach(({ itemSelector, fields }) => {
        config.form.find(itemSelector).each(function (idx) {
            let $item = jQuery(this);
            let index = idx + 1;
            fields.forEach(({ namePrefix, errorKeyPrefix, condition }) => {
                let selector = `[name^="${namePrefix}"]`;
                validateField($item, selector, errorKeyPrefix + index, condition);
            });
        });
    });

    return error;
}