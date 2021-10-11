const accordionSchema = require("../accordion.main.schema.json");
const sectionSchema = require("../accordion.section.schema.json");
const schema = require("../accordion.schema.json");

const Validator = require("jsonschema").Validator;
const v = new Validator();

v.addSchema(accordionSchema, "/AccordionSchema");
v.addSchema(sectionSchema, "/AccordionSection");

export default function validateSchema(data: object) {
  return v.validate(data, schema);
}
