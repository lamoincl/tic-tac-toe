// Fonctions
function isset(variable){return variable !== 'undefined' ? true : false}

function trv_adversaire(joueur){return joueur == 1 ? 2 : 1}

function condition_fin(grille,isNotASimulation) {
    var combh1 = grille.slice(0,3);
    var combh2 = grille.slice(3,6);
    var combh3 = grille.slice(6,9);
    
    var combv1 = [grille[0],grille[3],grille[6]];
    var combv2 = [grille[1],grille[4],grille[7]];
    var combv3 = [grille[2],grille[5],grille[8]];

    var combd1 = [grille[0],grille[4],grille[8]];
    var combd2 = [grille[2],grille[4],grille[6]];

    var combinaisons = [combh1,combh2,combh3,combv1,combv2,combv3,combd1,combd2]

    const index_comb = new Map();
    index_comb.set(0,[0,1,2]);
    index_comb.set(1,[3,4,5]);
    index_comb.set(2,[6,7,8]);
    index_comb.set(3,[0,3,6]);
    index_comb.set(4,[1,4,7]);
    index_comb.set(5,[2,5,8]);
    index_comb.set(6,[0,4,8]);
    index_comb.set(7,[2,4,6]);

    var vict = null, ega = new Array();

    for (let combi of combinaisons) {
        if (combi.every(function(data) {return data === 1;} )){
            vict = 1;
            ega.push(false);
            if (isNotASimulation) {
                for (let index of index_comb.get(combinaisons.indexOf(combi))) {$("#"+corres_index.get(index)).css("color","red");}}
            break;
        } else if (combi.every(function(data) {return data === 2;} )){
            vict = 2;
            ega.push(false);
            if (isNotASimulation) {
                for (let index of index_comb.get(combinaisons.indexOf(combi))) {$("#"+corres_index.get(index)).css("color","red");}}
            break;
        } else if (combi.some(function(data) {return data === 1;} ) && combi.some(function(data) {return data === 2;} )) {
            ega.push(true);
        } else {
            ega.push(false);
        }}

    if (ega.every(function(data){return data;})) {
        vict = 0;
    }      

    return vict;
}

function minimax(grille,joueur) {
    let adversaire = trv_adversaire(joueur);
    let test_grille = Object.values(grille),choix = new Map();

    for(let i=0;i<9;i++){if(grille[i]==0){choix.set(i,null);}}

    for (let index of choix.keys()) {
        test_grille[index] = joueur;

        switch (condition_fin(test_grille,false))  {
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
                choix.set(index,we_need_to_go_deeper(test_grille,joueur,false));
                break;
        }
        test_grille = Object.values(grille);
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
    var liste_index = [],solution_liste = [],test_grille = Object.values(grille);

    for(let i = 0; i < grille.length; ++i) {if(grille[i] == 0) {liste_index.push(i);}}

    for(let index of liste_index) {
        test_grille[index] = tour ? joueur : adversaire

        
        switch (condition_fin(test_grille,false))  {
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
                solution_liste.push(we_need_to_go_deeper(test_grille,joueur,!tour));
                break;
        }
        test_grille = Object.values(grille);
    }

    if (tour) {
        return solution_liste.reduce(function(a,b) {return Math.max(a,b);});
    } else {
        return solution_liste.reduce(function(a,b) {return Math.min(a,b);});
    }

}

// Déclaration constante 
const corres_index = new Map();
    corres_index.set(0,'a');
    corres_index.set(1,'z');
    corres_index.set(2,'e');
    corres_index.set(3,'r');
    corres_index.set(4,'t');
    corres_index.set(5,'y');
    corres_index.set(6,'u');
    corres_index.set(7,'i');
    corres_index.set(8,'o');

const invCorres_index = new Map();
    invCorres_index.set('a',0);
    invCorres_index.set('z',1);
    invCorres_index.set('e',2);
    invCorres_index.set('r',3);
    invCorres_index.set('t',4);
    invCorres_index.set('y',5);
    invCorres_index.set('u',6);
    invCorres_index.set('i',7);
    invCorres_index.set('o',8);

const corres_joueur = new Map();
    corres_joueur.set(1,'X');
    corres_joueur.set(2,'O');

// Déclaration des fonctions principales 
function setup(kiKiCommence,joueur) {
    grille = [0,0,0,0,0,0,0,0,0]
    $("#parent").children(".grille").html("<i>/</i>");
    if (kiKiCommence) {return tour_ordi(grille,trv_adversaire(joueur));}
    else {return grille;}
}

function tour_joueur(grille,joueur,indexJoue) {
    
    grille[indexJoue] = joueur;

    dessiner_sur_grille(indexJoue,joueur);

    grille = Object.values(tour_ordi(grille,trv_adversaire(joueur)));
    if(condition_fin(grille,false) != null){afficher_vict(condition_fin(grille,true));}

    return grille;
}

function tour_ordi(grille,joueur) {
    let index_joue = minimax(grille,joueur);

    grille[index_joue] = joueur;

    dessiner_sur_grille(index_joue,joueur);

    return grille;
}

function afficher_vict(gagnant) {
    var str_vict = '';
    switch (gagnant) {
        case 1:
            str_vict = '<b>X</b>  à gagné la partie !';
            break;
        case 2:
            str_vict = '<b>O</b>  à gagné la partie !';
            break;
        case 0:
            str_vict = 'Égalité !';
            break;
    }
    $("#parent").children(".valider").css("display","block");
    $("#fin").html(str_vict);

    console.log(str_vict);
}

function dessiner_sur_grille(index,joueur) {$("#"+corres_index.get(index)).html(corres_joueur.get(joueur))}

function affichage_html_joueur(joueur){
    if (joueur == 1) {
        $("#deux").css("background-color", "#eee");
        $("#un").css("background-color", "green");
    } else {
        $("#un").css("background-color", "#eee");
        $("#deux").css("background-color", "green");
    }
}

// Programme principal

$(document).ready(function() {

    var grille = [0,0,0,0,0,0,0,0,0], joueur = Math.round(Math.random())+1;
    affichage_html_joueur(joueur);

    $(".popup").css("left", (parseInt($("#background-popup").css("width"))-320)/2);
    $(".popup").css("top", (parseInt($("#background-popup").css("height"))-(parseInt($(".popup").css("height"))+20))/2);
    
    $("#parent").css("left", (parseInt($("#background-popup").css("width"))-305)/2);
    $("#parent").css("top", (parseInt($("#background-popup").css("height"))-305)/2);


    $("#parent").children(".grille").click(function() {
        if (condition_fin(grille,false) != null) {afficher_vict(condition_fin(grille,true));return null;}

        let index = invCorres_index.get($(this).attr("id"));

        if (grille[index] != 0) {return null;}

    
        grille = Object.values(tour_joueur(grille,joueur,index));
    })

    $("#un , #deux").click(function(){
        joueur = trv_adversaire(joueur);
        affichage_html_joueur(joueur);
    })

    $(".valider").click(function(){
        var kiCommence = Math.round(Math.random())+1 == 2;
        $("#background-popup").css("display","none");

        $("#info").html("Joueur : <b>"+corres_joueur.get(joueur)+"</b>");

        grille = Object.values(setup(kiCommence,joueur));
    })

    $("#relancer").click(function(){
        $("#fin").html("");
        $("#relancer").css("display","none");
        $('.grille').css("color","black");
    })
})