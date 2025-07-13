const { defaultFieldResolver } = require('graphql');

const authDirective = {
  name: 'auth',
  description: 'Directive for authorization checks',
  locations: ['FIELD_DEFINITION'],
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    
    field.resolve = async function (...args) {
      const [source, params, context, info] = args;
      const { user } = context;
      
      // Get the roles from the directive arguments
      const roles = info.fieldNodes[0].directives.find(
        directive => directive.name.value === 'auth'
      ).arguments.map(arg => arg.value.value);
      
      // Check if user exists and has required role
      if (!user) {
        throw new Error('Authentication required');
      }
      
      if (!roles.includes(user.role)) {
        throw new Error('Unauthorized: Insufficient permissions');
      }
      
      return resolve.apply(this, args);
    };
    
    return field;
  }
};

module.exports = authDirective;
