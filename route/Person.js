const express = require("express")
const Person = require("../model/person")
const person = require("../model/person")
const router=express.Router()




//ajout
router.post('/add',async(req,res)=>{
    try{
        const{Name,Age,favoriteFoods}=req.body;
        const newPerson=await Person.create({Name,Age,favoriteFoods});
        res.status(200).send({msg:'person added', newPerson})
    }catch(error){
        res.status(400).send({msg:'can not added person'})
    }
})

//afficher
router.get('/all',async(req,res)=>{
    try{
        const listPersons= await Person.find();
        res.status(200).send({msg:'person list:',listPersons:listPersons})
        
    }catch(error){
        res.status(400).send({msg:'not person'})

    }
})

// trouver toutes les personnes avec un nom donné


router.get('/:_Name', async (req, res) => {
    try {
        const name = req.params._Name;

        // Recherche d'une personne par son nom
        const person = await Person.findOne({ Name: name });

        // Vérification si une personne est trouvée
        if (!person) {
            return res.status(404).send({ 
                msg: `No person found with the name: ${name}` 
            });
        }

        // Envoie la personne trouvée en réponse
        res.status(200).send({msg: 'Person found',person: person});
    } catch (error) {
        console.error(error);
        // En cas d'erreur, envoie une réponse avec le message d'erreur
        res.status(500).send({msg: 'An unexpected error occurred', error: error.message});
    }
});








//Trouver Person par son food

router.get('/favfood/:_favoriteFoods', async (req, res) => {
    try {
        // Récupérer l'aliment spécifique depuis les paramètres de la requête
        const favoriteFood = req.params._favoriteFoods;

        // Rechercher les personnes ayant cet aliment dans leur liste de 'favoriteFoods'
        const people = await Person.find({ favoriteFoods: favoriteFood });

        // Vérifier si des personnes sont trouvées
        if (!people || people.length === 0) {
            return res.status(404).send({ 
                msg: `No persons found who like ${favoriteFood}` 
            });
        }

        // Retourner les personnes trouvées
        res.status(200).send({ 
            msg: `Persons found who like ${favoriteFood}`, 
            data: people 
        });
    } catch (error) {
        console.error(error);
        // En cas d'erreur, envoyer une réponse avec le message d'erreur
        res.status(500).send({ 
            msg: 'An error occurred', 
            error: error.message 
        });
    }
});



        // Cherche une personne dans la base de données par _id


      
router.get('/add/:_id', async (req, res) => {
    try {
        const personId = req.params._id;

        // Vérifie si l'ID est un ObjectId valide
        if (!/^[0-9a-fA-F]{24}$/.test(personId)) {
            return res.status(400).send({ msg: 'Invalid ID format' });
        }

        // Recherche de la personne par son _id
        const person = await Person.findById(personId);

        // Vérifie si la personne existe
        if (!person) {
            return res.status(404).send({ msg: 'Person not found' });
        }

        // Retourne la réponse
        res.status(200).send({ msg: 'Food added successfully', data: person });
    } catch (error) {
        // Gestion des erreurs
        console.error(error);
        res.status(500).send({ msg: 'An error occurred', error: error.message });
    }
});



// modifier un person et ajouter un food

router.put('/addfavfood/:_id', async (req, res) => {
    try {
        const personId = req.params._id;

        // Vérifie si l'ID est un ObjectId valide
        if (!/^[0-9a-fA-F]{24}$/.test(personId)) {
            return res.status(400).send({ msg: 'Invalid ID format' });
        }

        // Recherche de la personne par son _id
        const person = await Person.findById(personId);

        // Vérifie si la personne existe
        if (!person) {
            return res.status(404).send({ msg: 'Person not found' });
        }

        // Ajoute "hamburger" à la liste des aliments préférés
        person.favoriteFoods.push("hamburger");

        // Sauvegarde la personne mise à jour
        await person.save();
        
        res.status(200).send({ msg: 'Food added successfully', data: person });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'An error occurred', error: error.message });
    }
});

//Exécuter de nouvelles mises à jour sur un document 

        router.put('/update_age/:_Name', async (req, res) => {
            try {
                const personName = req.params._Name;
        
                // Recherche une personne par son nom et met à jour son âge
                const updatedPerson = await Person.findOneAndUpdate(
                    { Name: personName }, // Critère de recherche
                    { Age: 20 },          // Mise à jour
                    { new: true }         // Renvoie le document mis à jour
                );
        
                // Vérifie si la personne a été trouvée et mise à jour
                if (!updatedPerson) {
                    return res.status(404).send({ msg: 'Person not found' });
                }
        
                // Retourne la personne mise à jour
                res.status(200).send({ msg: 'Age updated successfully', data: updatedPerson });
            } catch (error) {
                // Gestion des erreurs
                console.error(error);
                res.status(500).send({ msg: 'An error occurred', error: error.message });
            }
        });
        

//Supprimer un document 


router.delete('/delate_person/:_id',async(req,res)=>{
    try{
        const{_id}=req.params;
        await Person.findOneAndDelete({_id})
        res.status(200).send({msg:'person delated',persondelated:_id})
        
    }catch(error){
        res.status(400).send({msg:'can not delate person'})

    }
    
})
// Supprimer plusieurs documents avec Model.remove()
router.delete('/delete-many/:_Name', async (req, res) => {
    try {
        const { _Name } = req.params;

        // Utilisation de Model.remove()
        const result = await Person.deleteMany({ Name: _Name });

        if (result.deletedCount === 0) {
            return res.status(404).send({msg: 'No persons found with the specified name',name: _Name});
        }

        res.status(200).send({msg: 'Persons deleted successfully', deletedCount: result.deletedCount,name: _Name});
    } catch (error) {
        console.error(error);
        res.status(400).send({msg: 'An error occurred',error: error.message
        });
    }
});



// Aides à la recherche de chaîne pour affiner les résultats


router.get('/food/:_favoriteFoods', async (req, res) => {
    try {
        const favoriteFood = req.params._favoriteFoods; // Récupérer l'aliment depuis les paramètres

        // Utiliser `async/await` pour exécuter la requête
        const people = await Person.find({ favoriteFoods: favoriteFood }) // Rechercher par aliment
            .sort({ Name: 1 }) // Trier par le champ 'Name' (ordre croissant)
            .limit(2) // Limiter les résultats à 2 documents
            .select('-Age'); // Masquer le champ 'Age'

        // Vérifier si des personnes sont trouvées
        if (!people || people.length === 0) {
            return res.status(404).send({ 
                msg: `No persons found who like ${favoriteFood}` 
            });
        }

        // Retourner les personnes trouvées
        res.status(200).send({ 
            msg: `Persons found who like ${favoriteFood}`, 
            data: people 
        });

    } catch (error) {
        console.error(error);
        res.status(400).send({ 
            msg: 'An unexpected error occurred', 
            error: error.message 
        });
    }
});

module.exports= router