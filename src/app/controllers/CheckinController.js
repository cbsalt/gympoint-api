import { startOfWeek, endOfWeek, subDays } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;
    const checkins = await Checkin.findAll({
      where: { student_id: id },
    });
    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;

    const today = Number(new Date());
    const startCheckin = Number(subDays(today, 7));

    const maxCheckins = await Checkin.findAll({
      where: {
        student_id: id,
        created_at: {
          [Op.between]: [startOfWeek(startCheckin), endOfWeek(today)],
        },
      },
    });

    if (maxCheckins && maxCheckins.length >= 5)
      return res.status(401).json('You can only do 5 checkin every 7 days');

    await Checkin.create({ student_id: id });

    return res.json({ message: 'Check-in done successfully' });
  }
}

export default new CheckinController();
