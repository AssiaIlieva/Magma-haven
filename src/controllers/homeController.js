const router = require('express').Router();

const volcanoService = require('../services/volcanoService');


router.get('/', (req, res) => {
    res.render('home')
});

router.get('/search', async (req, res) => {
    const {name, typeVolcano} = req.query;
    
    let volcanoes = []
    if(name || (typeVolcano)){
        volcanoes = await volcanoService.search(name, typeVolcano).lean();
    }else{
        volcanoes = await volcanoService.getAll().lean();
    }
    res.render('search', {volcanoes, name, typeVolcano})
})


module.exports = router