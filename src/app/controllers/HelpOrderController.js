import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const orders = await HelpOrder.findAll({
      where: { answer_at: null },
    });

    return res.json(orders);
  }

  async list(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params)))
      return res.status(400).json({ error: 'Validation fails' });

    const { student_id } = req.params;
    const student = await Student.findByPk(student_id);

    if (!student)
      return res.status(400).json({ error: 'Student does not exist' });

    await HelpOrder.findAll({
      where: { student_id },
    });

    return res.json({ message: "You haven't asked any questions yet" });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    const { id } = req.params;
    const { question } = req.body;
    const student = await Student.findByPk(id);

    if (!student)
      return res.status(400).json({ error: 'Student does not exist' });

    const helpOrders = await HelpOrder.create({ student_id: id, question });

    return res.json(helpOrders);
  }
}

export default new HelpOrderController();
