import { IReport, IReportInputDTO } from '@/interfaces/IReport';
import { ITrip } from '@/interfaces/ITrip';
import { IUser } from '@/interfaces/IUser';
import { ReportRepository } from '@/repositories/reportRepository';
import { TripRepository } from '@/repositories/tripRepository';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import dayjs from 'dayjs';

@Service()
export class ReportService {
  protected reportRepositoryInstance: ReportRepository;
  protected tripRepositoryInstance: TripRepository;
  protected logger: Logger;

  constructor(reportRepository: ReportRepository, tripRepository: TripRepository, @Inject('logger') logger: Logger) {
    this.reportRepositoryInstance = reportRepository;
    this.tripRepositoryInstance = tripRepository;
    this.logger = logger;
  }

  public generateReport = async (tripId: ITrip['_id']) => {
    try {
      this.logger.silly('Getting Trip record with user info');

      const tripRecord = await this.tripRepositoryInstance.findTripWithUserInfo(tripId);
      if (!tripRecord) throw 'Trip does not exists.';

      const {
        weightTrash,
        distanceMeter,
        isCompleted,
        isDumped,
        _id,
        userId,
        dustbinId,
        createdAt,
        weightPerson,
        heightCM,
        gender,
        dob,
      } = tripRecord;

      const age = this.getAge(dob);
      const calories = this.getCalories(gender, weightPerson, weightTrash, heightCM, age);

      const now = new Date();
      const timeDiffSeconds = (now.getTime() - new Date(createdAt).getTime()) / 1000;
      const speedKMpH = ((distanceMeter / timeDiffSeconds) * 18) / 5;

      this.logger.silly('Creating report record');
      const reportRecord = await this.reportRepositoryInstance.createReport({
        userId,
        tripId,
        calories,
        'distance(KM)': distanceMeter / 1000,
        'speed(KMH)': speedKMpH,
        'time(S)': timeDiffSeconds,
        'trash(KG)': weightTrash,
      });

      return reportRecord;
    } catch (e) {
      throw e;
    }
  };

  public getPreviousWalks = async (userId: ITrip['userId']) => {
    try {
      this.logger.silly('Getting all reports for userId', userId);

      const reports = await this.reportRepositoryInstance.getAllReports(userId); // sorted in descending order
     
      const results = [];
     
      for (let i = 0; i < reports.length; i++) {
        const report = reports[i];

        let previousReport = {};
        if (i < reports.length - 1) previousReport = reports[i + 1]; //since they are in descending order
        
        const obj = {};
        obj['date'] = dayjs(report['createdAt']).format('DD MMMM');
        obj['distance'] = `${Math.round(report['distance(KM)'] * 100) / 100} km`;
        obj['calories'] = `${Math.round(report['calories'] * 100) / 100} g`;
        
        const caloriesDelta = report['calories'] - (previousReport['calories'] || 0);
        const distanceDelta = report['distance(KM)'] - (previousReport['distance(KM)'] || 0);
        const changeInCalories = caloriesDelta / report['calories'];
        const changeInDistance = distanceDelta / report['distance(KM)'];
        obj['changeInCalories'] = changeInCalories;
        obj['changeInDistance'] = changeInDistance;
        
        results.push(obj);
      }

      return results;
    } catch (e) {
      throw e;
    }
  };

  public getAllReports = async (userId: ITrip['userId']) => {
    try {
      this.logger.silly('Getting all reports for userId', userId);

      const reports = await this.reportRepositoryInstance.getAllReports(userId);

      return { reports };
    } catch (e) {
      throw e;
    }
  };

  public getReport = async (userId: ITrip['userId'], tripId: IReport['tripId']) => {
    try {
      this.logger.silly('Getting Report record for tripId', tripId);

      const reportRecord = await this.reportRepositoryInstance.getReportByTripId(tripId, userId);
      return reportRecord;
    } catch (e) {
      throw e;
    }
  };

  public takeFeedback = async (reportId: IReport['_id'], userFeedback: IReport['userFeedback']) => {
    try {
      this.logger.silly('Putting feedback for report id', reportId);

      const reportRecord = await this.reportRepositoryInstance.putFeedback(reportId, userFeedback);
      return reportRecord;
    } catch (e) {
      throw e;
    }
  };

  private getCalories = (
    gender: IUser['gender'],
    weightPerson: IUser['weightKG'],
    weightTrash: ITrip['weightKG'],
    heightCM: IUser['heightCM'],
    ageYears: number,
  ) => {
    const weight = weightPerson + weightTrash / 2;
    let BMR: number;
    if (gender == 'Male' || gender == 'Other') {
      BMR = 66.47 + 13.75 + 13.75 * weight + 5.003 * heightCM - 6.755 * ageYears;
    } else {
      BMR = 655.1 + 9.563 * weight + 1.85 * heightCM - 4.676 * ageYears;
    }
    return (BMR * 1000) / 24;
  };

  private getAge = dateString => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
}
