export default function(pseudo = null, action) {
  
    if(action.type == 'savePseudo') {
        return action.newPseudo;
    } else {
        return pseudo;
    }
}