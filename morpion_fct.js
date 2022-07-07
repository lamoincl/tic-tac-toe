function isset(variable){return variable !== 'undefined' ? true : false}

function trv_adversaire(joueur){return joueur == 1 ? 2 : 1}

function condition_fin(grille) {
    var combh1 = grille.slice(0,3);
    var combh2 = grille.slice(3,6);
    var combh3 = grille.slice(6,9);
    
    var combv1 = [grille[0],grille[3],grille[6]];
    var combv2 = [grille[1],grille[4],grille[7]];
    var combv3 = [grille[2],grille[5],grille[8]];

    var combd1 = [grille[0],grille[4],grille[8]];
    var combd2 = [grille[2],grille[4],grille[6]];

    var combinaisons = [combh1,combh2,combh3,combv1,combv2,combv3,combd1,combd2]

    var vict = null, ega = new Array();

    combinaisons.forEach(function(combi) {
        if (combi.every(function(data) {return data === 1;} )){
            vict = 1;
        } else if (combi.every(function(data) {return data === 2;} )){
            vict = 2;
        } else if (combi.some(function(data) {return data === 1;} ) && combi.some(function(data) {return data === 2;} )) {
            ega.push(true);
        } else {
            ega.push(false);
        }})

    if (ega.every(function(data){return data;})) {
        vict = 0;
    }      

    return vict;
}

function minimax(grille,joueur) {
    var adversaire = trv_adversaire(joueur);
    var test_grille = grille,choix = new Map();

    for(let i=0;i<9;i++){if(grille[i]==0){choix.set(i,null);}}

    for (let index of choix.keys()) {
        test_grille[index] = joueur;

        switch (condition_fin(test_grille))  {
            case joueur : 
                choix.set(index,1);
                break;
            case adversaire :
                choix.set(index,-1);
                break;
            case 0 :
                choix.set(index,0);
                break;
            case null :
                choix.set(index,we_need_to_go_deeper(grille,joueur,true));
                break;
        }
        test_grille[index] = 0;
    }
    
    var liste_1 = [],liste_0 = [],liste_m1 = [];
    
    for (let [index,val] of choix) {
        if (val == 1) {liste_1.push(index);}
        else if (val == 0) {liste_0.push(index);}
        else {liste_m1.push(index);}
    }

    console.log(choix);

    for (let liste of [liste_1,liste_0,liste_m1]) {
        if (liste != '') {return liste[Math.round(Math.random() * (liste.length - 1))];}
    }
}

function we_need_to_go_deeper(grille,joueur,tour) {
    var adversaire = trv_adversaire(joueur);
    var liste_index = grille,solution_liste = [],test_grille = [];

    for(let i = 0; i < grille.length; ++i) {if(grille[i] == 0) {liste_index.push(i);}}

    for(let index of liste_index) {
        test_grille[index] = tour ? joueur : adversaire

        
        switch (condition_fin(test_grille))  {
            case joueur : 
                if (tour) {return 1;} 
                else {solution_liste.push(1);}
                break;
            case adversaire :
                if (tour) {solution_liste.push(-1);} 
                else {return -1;}
                break;
             case 0 :
                solution_liste.push(0);
                break;
            case null :
                solution_liste.push(we_need_to_go_deeper(grille,joueur,!tour));
                break;
        }
        test_grille[index] = 0;
    }

    console.log(solution_liste);

    if (tour) {
        return solution_liste.reduce(function(a,b) {return Math.max(a,b);});
    } else {
        return solution_liste.reduce(function(a,b) {return Math.min(a,b);});
    }

}