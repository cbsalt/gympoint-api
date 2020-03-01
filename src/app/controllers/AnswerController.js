import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';

class AnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const helpOrder = await HelpOrder.findByPk(req.params.id, {
      include: {
        model: Student,
        as: 'student',
        attributes: ['name', 'email'],
      },
    });
    if (!helpOrder) {
      return res.status(400).json({ error: 'Help order not found' });
    }

    const {
      id,
      student,
      question,
      answer,
      answer_at,
    } = await helpOrder.update({ ...req.body, answer_at: new Date() });

    Queue.add(AnswerMail.key, {
      student,
      question,
      answer,
    });

    return res.json({ id, student, question, answer, answer_at });
  }
}

export default new AnswerController();
