import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment } = data.createdEnrollment;

    await Mail.sendMail({
      to: `{$enrollment.student.name} <${enrollment.student.email}>`,
      subject: 'Matrícula confirmada',
      template: 'enrollment',
      context: {
        name: enrollment.student.name,
        plan: enrollment.plan.title,
        start_date: format(parseISO(enrollment.start_date), "dd'-'MM'-'yyyy"),
        plan_title: enrollment.plan.title,
        plan_duration: enrollment.plan.duration,
        price: enrollment.price,
        plan_expiration: format(
          parseISO(enrollment.end_date),
          "dd'-'MM'-'yyyy"
        ),
      },
    });
  }
}

export default new EnrollmentMail();
