import client from '@/src/app/lib/mongodbConfig';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parseJwt } from '@/global';

const percentage = (percentage, total) => (total * percentage) / 100;
const annualCalculation = (value) => value * 12;

const ftHandler = async (req, res) => {
  const { method } = req;
  const headersList = await headers();
  const token = headersList.get('token');
  const user = parseJwt(token);
  const dbClient = await client;
  const db = dbClient.db('rxtn');

  switch (method) {
    case 'POST':
      const body = await req.json();

      const idealValue = Object.fromEntries(
        Object.entries(body).map(([key, value]) => [
          key,
          percentage(
            body?.monthly_income,
            {
              house_emi_or_rent: 20,
              emi: 8,
              provisions_expenses: 8,
              carbike_expenses: 5,
              entertainment_ott_outing: 2.5,
              telephone_wifi: 2,
              eb_water: 1,
              other_investments: 2,
              lic_insurance_post_office: 2,
              term_health_insurance: 4,
              bike_car_insurance: 2,
              school_fee: 10,
              entertainment_ott: 2.5,
              water: 1,
              tours_travels: 5,
              medical_expenses: 5,
              unexpected_emergency: 2.5,
              other_annual_expenses: 2.5,
            }[key]
          ),
        ])
      );

      const annualValue = Object.fromEntries(
        Object.entries(body).map(([key, value]) => [
          key,
          annualCalculation(value),
        ])
      );

      const healthStatus = Object.fromEntries(
        Object.entries(idealValue).map(([key, value]) => [
          key,
          body[key] <= value ? 'good' : 'bad',
        ])
      );

      const hasMoreGood = (obj) => {
        let goodCount = 0;
        let otherCount = 0;

        Object.values(obj).forEach((value) => {
          if (value === 'good') {
            goodCount++;
          } else {
            otherCount++;
          }
        });

        return goodCount > otherCount;
      };

      if (user?.role === 'customer') {
        const updatedData = {
          created_by_id: user?.id,
          created_by: user?.name,
          customer_id: user?.id,
          customer_name: user?.name,
          created_at: new Date(),
          health_status: healthStatus,
          overall_health_status: hasMoreGood(healthStatus) ? 'good' : 'bad',
          actualValue: body,
          idealValue,
          annualValue,
        };

        try {
          const product = await db
            .collection('finance-tracker')
            .insertOne(updatedData);
          return NextResponse.json(product);
        } catch (e) {
          console.error(e);
        }
      } else {
        return NextResponse.json({ message: 'You are not allowed' });
      }
    case 'GET':
      if (user) {
        const eventsList = await db
          .collection('finance-tracker')
          .find()
          .sort({ created_at: -1 })
          .toArray();
        return NextResponse.json(eventsList);
      } else {
        return NextResponse.json({ message: "It's wrong buddy!" });
      }
    default:
      return NextResponse.json({ message: "It's wrong buddy!" });
  }
};

export { ftHandler as GET, ftHandler as POST };
