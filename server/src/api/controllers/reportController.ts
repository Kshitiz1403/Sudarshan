import { IReport } from '@/interfaces/IReport';
import { ReportService } from '@/services/reportService';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import { INextFunction, IRequest, IResponse } from '../types/express';
import { Result } from '../util/result';

@Service()
export class ReportController {
  protected reportServiceInstance: ReportService;
  protected logger: Logger;

  constructor(reportService: ReportService, @Inject('logger') logger: Logger) {
    this.reportServiceInstance = reportService;
    this.logger = logger;
  }

  public addFeedback = async (req: IRequest, res: IResponse, next: INextFunction) => {
    this.logger.debug('Calling add feedback endpoint with body %o', req.body);

    try {
      const reportId = req.body.reportId as IReport['_id'];
      const feedback = req.body.feedback as IReport['userFeedback'];

      const report = await this.reportServiceInstance.takeFeedback(reportId, feedback);
      return res.status(200).json(Result.success(report));
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  public getPreviousWalks = async (req: IRequest, res: IResponse, next: INextFunction) => {
    this.logger.debug('Calling get previous walks endpoint with query %o', req.query);

    try {
      const userId = req.currentUser.userId;

      const reports = await this.reportServiceInstance.getPreviousWalks(userId);
      return res.status(200).json(Result.success(reports));
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      return next(e);
    }
  };
}
