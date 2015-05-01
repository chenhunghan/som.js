/**
 * Created by chh on 2015/5/1.
 */
it('should take less than 500ms', function(done){
    this.timeout(500);
    setTimeout(done, 300);
})