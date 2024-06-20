const { isAuth } = require('../middlewares/authMiddlware');
const volcanoService = require('../services/volcanoService');
const {getErrorMessage} = require('../utils/errorUtils');

const router = require('express').Router();

router.get('/create', isAuth, (req, res) => {
    res.render('volcanoes/create')
});

router.post('/create', isAuth, async (req, res) => {
    const volcanoData = req.body;
    try {
        await volcanoService.create(req.user._id, volcanoData);
        res.redirect('/volcanoes')
    } catch (error) {
        const message = getErrorMessage(error);
        res.render('volcanoes/create', {...volcanoData, error: message})
    };
});

router.get('/', async (req, res) => {
  const volcanoes = await volcanoService.getAll().lean();
  res.render('volcanoes/catalog', {volcanoes});
});

router.get('/:volcanoId/details', async(req, res) => {
    const volcano = await volcanoService.getOneWithOwner(req.params.volcanoId).lean();
    const votesCount = volcano.voteList.length;
    const isOwner = volcano.owner && volcano.owner._id == req.user?._id;
    const isVoted = volcano.voteList.some(user => user._id == req.user?._id);
    res.render('volcanoes/details', {...volcano, votesCount, isOwner, isVoted});
});

router.get('/:volcanoId/vote', isAuth, async (req, res) => {
    await volcanoService.vote(req.params.volcanoId, req.user._id);
    res.redirect(`/volcanoes/${req.params.volcanoId}/details`);
});

router.get('/:volcanoId/edit', isVolcanoOwner, async (req, res) => {
    res.render('volcanoes/edit', {...req.volcano})
});

router.post('/:volcanoId/edit', isVolcanoOwner, async (req, res) => {
    const volcanoData = req.body;
    try {
        await volcanoService.edit(req.params.volcanoId, volcanoData);
        res.redirect(`/volcanoes/${req.params.volcanoId}/details`)
    } catch (error) {
        res.render('volcanoes/edit', {...volcanoData, error: getErrorMessage(error)})
    }
});

router.get('/:volcanoId/delete', isVolcanoOwner, async(req, res) => {
    await volcanoService.delete(req.params.volcanoId);
    res.redirect('/volcanoes')
});


async function isVolcanoOwner(req, res, next) {
    const volcano = await volcanoService.getOne(req.params.volcanoId).lean();
    if(volcano.owner != req.user?._id) {
        return res.redirect(`/volcanoes/${req.params.volcanoId}/details`);
    }
    req.volcano = volcano
    next();
};


module.exports = router;