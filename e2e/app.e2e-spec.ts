import { ReplanTestingGuiPage } from './app.po';

describe('replan-testing-gui App', function() {
  let page: ReplanTestingGuiPage;

  beforeEach(() => {
    page = new ReplanTestingGuiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
