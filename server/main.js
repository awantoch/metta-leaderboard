import '../imports/api/users.js';

Accounts.validateNewUser((user) => {
  new SimpleSchema({
    _id: { type: String },
    emails: { type: Array },
    'emails.$': { type: Object },
    'emails.$.address': { type: String },
    'emails.$.verified': { type: Boolean },
    createdAt: { type: Date },
    services: { type: Object, blackbox: true },
    username: { type: String },
    profile: { type: Object },
    'profile.name': { type: String },
    'profile.bio': { type: String },
    'profile.social_media': { type: String },
    'profile.score': { type: Number },
  }).validate(user);

  // Return true to allow user creation to proceed
  return true;
});
