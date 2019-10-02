import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

if (Meteor.isServer) {
  // This code only runs on the server

  Meteor.users.deny({
    update() { return true; }
  });

  Meteor.publish('users', function (){
    return Meteor.users.find({}, {
      fields: { username: 1, profile: 1 },
      sort: { 'profile.score': -1 }
    });
  });
}

Meteor.methods({

  'score.set'(userId, score) {
    const username = Meteor.user().username;
    if (username === "metta-admin") {
      check(userId, String);
      check(score, Number);

      Meteor.users.update(userId, { $set: { "profile.score": score }});
    } else {
      console.log('unauthorized access from', username);
    }
  },

});
