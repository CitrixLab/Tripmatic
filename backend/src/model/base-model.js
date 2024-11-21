const { Model, QueryBuilder, AjvValidator } = require("objection");

const addFormats = require('ajv-formats').default;

class DefaultSchemaQueryBuilder extends QueryBuilder {
    constructor(modelClass) {
        super(modelClass);
        if (modelClass.defaultSchema) {
            this.withSchema(modelClass.defaultSchema);
        }
    }
}

class BaseModel extends Model {
    // Add all shared configurations here
    static get QueryBuilder() {
        return DefaultSchemaQueryBuilder;
    }

    static createValidator() {
        return new AjvValidator({
            onCreateAjv: (ajv) => {
                addFormats(ajv);
            },
            options: {
                allErrors: true,
                validateSchema: false,
                ownProperties: true,
                v5: true,
            },
        });
    }
};

module.exports = BaseModel;