/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import JobsController from '#controllers/jobs_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/jobs', [JobsController, 'index']);
router.get('/jobs/:id', [JobsController, 'show']);
router.put('/jobs/:id/favorite', [JobsController, 'favoriteJob']);
