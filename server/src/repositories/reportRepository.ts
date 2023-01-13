import { IReport, IReportInputDTO } from '@/interfaces/IReport';
import { ITrip } from '@/interfaces/ITrip';
import { Service } from 'typedi';
import ReportModel from '@/models/report';
import TripModel from '@/models/trip';

@Service()
export class ReportRepository {
  constructor() {}

  public createReport = async (reportInputDTO: IReportInputDTO) => {
    try {
      const tripRecord = await TripModel.findOne({ userId: reportInputDTO.userId, _id: reportInputDTO.tripId });
      if (!tripRecord) throw 'You are not authorized to access this resource.';

      const reportRecord = await ReportModel.create({
        ...reportInputDTO,
      });
      if (reportRecord) return reportRecord.toObject();
      return null;
    } catch (e) {
      throw e;
    }
  };

  public getReportByTripId = async (tripId: ITrip['_id'], userId: ITrip['userId']) => {
    const docs = await TripModel.aggregate([
      {
        $match: {
          _id: tripId,
          userId: userId,
        },
      },
      {
        $lookup: {
          from: 'reports',
          localField: '_id',
          foreignField: 'tripId',
          as: 'reports',
        },
      },
      {
        $unwind: {
          path: '$reports',
        },
      },
    ]);
    if (!docs || docs.length == 0) return null;
    return docs[0]['reports'];
  };

  public getAllReports = async (userId: ITrip['userId']) => {
    const docs = await ReportModel.find({ userId });
    return docs;
  };

  public putFeedback = (reportId: IReport['_id'], userFeedback: IReport['userFeedback']) => {
    return ReportModel.findOneAndUpdate({ _id: reportId }, { $set: { userFeedback } }, { new: true }, (err, doc) => {
      if (err) throw err;
      return doc;
    }).lean();
  };
}
